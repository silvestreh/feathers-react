# feathers-react

> A [Feathers](https://www.feathersjs.com) real-time React component library to display data

## Install

```bash
npm install --save feathers-react
```

## Documentation

`feathers-react` consists of just a handful of React Components to help you display data coming from your Feathers API in real-time. Make sure to go through the [channels docs](https://docs.feathersjs.com/api/channels.html) to set up real-time events, otherwise the components won't update _automagically_.

### Table props

<!-- | `prop` | Desc | No | `null` | -->

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `service` | The Feathers service to get data from. | Yes | `null` |
| `query` | A [Feathers query](https://docs.feathersjs.com/api/databases/querying.html) object to run against the specified `service`. | No | `{}` |
| `keyProp` | The result's property to use as `key`. | Yes | `'id'` |
| `onRowClick` | Click event handler for a table row. The function takes two arguments: the row's data and its `index`. | No | `(row, index) => {}` |
| `countTemplate` | A string to use as template for showing items count. For example, `'Showing {start} to {end} of {total}'` would render something like `Showing 1 to 10 of 25`. | No | `null` |
| `language` | The locale name to render translated text. Supported locales are `['fr_FR', 'en_US', 'es_ES']`. | No | `'en_US'` |
| `usePagination` | Determines wether to use the `<Pagination />` component. | No | `false` |
| `paginationProps` | An `Object` to override [`rc-pagination`](https://github.com/react-component/pagination)'s props. | No | `null` |

### Column props

<!-- | `prop` | Desc | No | `null` | -->

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `dataSource` | The result's property to extract data from. | Yes | `null` |
| `render` | A render function that takes two arguments: the data for the column and the row's data. For example, `imageUrl => <img src={imageUrl} />` would render an image in the table cell. | No | `null` |
| `title` | A string to use as the header for the column. | No | `null` |
| `width` | The column's visual width, in pixels. | No | `null` |

### Example

In this simple example, the `<Table />` component takes a `client` prop which is a [Feathers client](https://docs.feathersjs.com/api/authentication/client.html).

```jsx
import React from 'react';
import { Column, Table } from 'feathers-react';

export default ({ client }) => {
  const service = client.service('some-service');
  const query = { $sort: { name: 1 } };

  return (
    <Table service={service} query={query}>
      <Column
        title="Image"
        dataSource="imageUrl"
        render={(data, row) => (
          <img alt={row.name} src={data} />
        )} />
      <Column
        title="Name"
        dataSource="name" />
    </Table>
  );
};
```

### Container props

The `<Container />` component is a generic wrapper that you can use to present data in a different format than tabular. It shares most props with the `<Table />` component, the main difference is that it doesn't take any children, but has a `renderItem` prop to render data.

| Name | Description | Required | Default value |
|------|-------------|----------|---------------|
| `service` | The Feathers service to get data from. | Yes | `null` |
| `query` | A [Feathers query](https://docs.feathersjs.com/api/databases/querying.html) object to run against the specified `service`. | No | `{}` |
| `keyProp` | The result's property to use as `key`. | Yes | `'id'` |
| `renderItem` | A render function that can return a React component. The function takes two arguments: the row's data and its `index`. | No | `(row, index) => <SomeComponent key={row.id} data={row} />` |
| `countTemplate` | A string to use as template for showing items count. For example, `'Showing {start} to {end} of {total}'` would render something like `Showing 1 to 10 of 25`. | No | `null` |
| `language` | The locale name to render translated text. Supported locales are `['fr_FR', 'en_US', 'es_ES']`. | No | `'en_US'` |
| `usePagination` | Determines wether to use the `<Pagination />` component. | No | `false` |
| `paginationProps` | An `Object` to override [`rc-pagination`](https://github.com/react-component/pagination)'s props. | No | `null` |

### Example

```jsx
import React from 'react';
import { Container } from 'feathers-react';
import SomeComponent from './some-component';

export default ({ client }) => {
  const service = client.service('some-service');
  const query = { $sort: { name: 1 } };

  return (
    <Container
      service={service}
      query={query}
      renderItem={(data, index) => (
        <SomeComponent key={data.id} data={data} />
      )} />
  );
};
```

## License

MIT © [Silvestre Herrera](https://github.com/silvestreh)
