import { Component } from 'react';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import sift from 'sift';
import PropTypes from 'prop-types';
import { allowedOperators } from '../utils';

class FeathersReact extends Component {
  static propTypes = {
    keyProp: PropTypes.string,
    language: PropTypes.oneOf([
      'en_US',
      'es_ES',
      'fr_FR'
    ]),
    query: PropTypes.object,
    service: PropTypes.object.isRequired
  };

  static defaultProps = {
    keyProp: 'id',
    language: 'en_US',
    query: {}
  };

  state = { data: [], isLoading: false, pagination: null, $skip: 0 };

  find = async () => {
    this.setState({ isLoading: true });

    try {
      const { query, service } = this.props;
      const { $skip } = this.state;
      const q = { ...query, $skip };
      const response = await service.find({ query: q });
      const pagination = {
        current: response.skip / response.limit + 1,
        pageSize: response.limit,
        total: response.total
      };

      /* istanbul ignore next */
      if (Array.isArray(response)) {
        return this.setState({ data: response, isLoading: false });
      }

      return this.setState({
        data: response.data,
        isLoading: false,
        pagination
      });
    } catch (e) {
      this.setState({ isLoading: false });
      throw e;
    }
  };

  pageChange = page => {
    const $skip = (page - 1) * this.state.pagination.pageSize;
    this.setState({ $skip });
  };

  isRecordInData = record => {
    const { data } = this.state;
    const { keyProp } = this.props;
    const index = data.findIndex(r => r[keyProp] === record[keyProp]);
    return { index, isInData: index >= 0 };
  };

  handlePatch = updated => {
    const { data } = this.state;
    const shouldUpdate = this.isRecordInData(updated);

    if (shouldUpdate.isInData) {
      data[shouldUpdate.index] = updated;
      this.setState({ data });
    }
  };

  handleRemove = async removed => {
    const { service, query } = this.props;
    const { data, pagination } = this.state;
    const shouldRemove = this.isRecordInData(removed);
    let p = null;

    if (shouldRemove.isInData) {
      data.splice(shouldRemove.index, 1);

      if (!data.length && pagination && pagination.current > 1) {
        return this.pageChange(pagination.current - 1);
      }
    }

    if (shouldRemove.isInData && pagination.total > pagination.pageSize) {
      const $skip = (pagination.pageSize * pagination.current) - 1;
      const q = { ...query, $skip, $limit: 1 };
      const response = await service.find({ query: q });
      const nextItem = Array.isArray(response) ? response[0] : response.data[0];

      if (nextItem) {
        data.push(nextItem);
      }
    }

    if (pagination) {
      p = {
        ...pagination,
        total: pagination.total - 1
      };
    }

    this.setState({ data, pagination: p });
  };

  handleCreate = created => {
    const { query } = this.props;
    const { data, pagination } = this.state;
    const keys = Object.keys(query)
      .filter(key => (
        key.includes('$') && !allowedOperators.includes(key)
      ));
    const filter = sift(omit(query, ...keys));
    let p = null;

    if (filter(created)) {
      data.unshift(created);
      data.pop();
    }

    if (pagination) {
      p = {
        ...pagination,
        total: pagination.total + 1
      };
    }

    this.setState({ data, pagination: p });
  };

  componentDidUpdate (prevProps, prevState) {
    const shouldFind = (
      this.state.$skip !== prevState.$skip ||
      !isEqual(this.props.query, prevProps.query)
    );

    if (shouldFind) {
      this.find();
    }
  }

  componentDidMount () {
    const { service } = this.props;

    service.on('patched', this.handlePatch);
    service.on('updated', this.handlePatch);
    service.on('removed', this.handleRemove);
    service.on('created', this.handleCreate);
    this.find();
  }

  componentWillUnmount () {
    const { service } = this.props;

    service.removeListener('patched', this.handlePatch);
    service.removeListener('updated', this.handlePatch);
    service.removeListener('removed', this.handleRemove);
    service.removeListener('created', this.handleCreate);
  }
}

export default FeathersReact;
