import Adapter from './application';
import { assign } from '@ember/polyfills';
const PRIMARY_KEY = 'Id';
export default Adapter.extend({
  urlForQuery: function(query, modelName) {
    return this.appendURL('internal/ui/services');
  },
  urlForQueryRecord: function(query, modelName) {
    const id = query.id;
    delete query.id;
    return this.appendURL('health/service', [id]);
  },
  isQueryRecord: function(parts) {
    const url = parts
      .slice(0, -1)
      .concat([''])
      .join('/');
    return this.urlForQueryRecord({ id: '' }) === url;
  },
  handleResponse: function(status, headers, payload, requestData) {
    let response = payload;
    const parts = requestData.url.split('/');
    if (this.isQueryRecord(parts)) {
      response = {
        [PRIMARY_KEY]: parts.pop(),
        Nodes: response,
      };
    } else {
      // isQuery
      response = response.map(function(item, i, arr) {
        return assign({}, item, {
          [PRIMARY_KEY]: item.Name,
        });
      });
    }
    return this._super(status, headers, response, requestData);
    // return this._super(status, headers, {services: response}, requestData);
  },
});
