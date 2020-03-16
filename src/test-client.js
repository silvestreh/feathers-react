import feathers from '@feathersjs/client';
import faker from 'faker';
import times from 'lodash.times';

const fakeId = () => Math.random().toString(36).substring(7);
const fakeMsg = id => ({
  id: typeof id === 'number' ? fakeId() : id,
  text: faker.lorem.sentence(),
  author: 'Silvestre'
});

const feathersClient = () => {
  const app = feathers();
  const data = [
    ...times(8, fakeMsg),
    { id: 'id-to-remove', text: 'Removed message', author: 'Feathers' },
    { id: 'id-to-patch', text: 'Patched message', author: 'Feathers' }
  ];

  app.use('/messages', {
    create: async payload => ({ id: fakeId(), ...payload }),
    find: async params => {
      const { query } = params;

      return {
        data: query.$skip && query.$limit ? [{
          id: fakeId(),
          text: 'Something random',
          author: 'Feathers'
        }] : query.author
          ? data.filter(({ author }) => author === query.author)
          : data,
        limit: query.$limit || 10,
        skip: query.$skip || 0,
        total: 15
      };
    },
    patch: async (id, payload) => ({ id, ...payload }),
    remove: async id => fakeMsg(id),
    update: async (id, payload) => ({ id, ...payload })
  });

  app.use('/not-paginated', {
    create: async payload => ({ id: fakeId(), ...payload }),
    find: async () => data,
    patch: async (id, payload) => ({ id, ...payload }),
    remove: async id => fakeMsg(id),
    update: async (id, payload) => ({ id, ...payload })
  });

  return app;
};

export default feathersClient();
