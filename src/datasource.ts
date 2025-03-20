import { getBackendSrv, isFetchError } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  createDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, DataSourceResponse } from './types';
import { lastValueFrom } from 'rxjs';


import ping from 'ping';


export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  ip  : string;
  port: string;
  user: string;
  pass: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.ip   = instanceSettings.jsonData.ip!;
    this.port = instanceSettings.jsonData.port!;
    this.user = instanceSettings.jsonData.user!;
    this.pass = instanceSettings.jsonData.password!;
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      return createDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async request(url: string, params?: string) {
    const response = getBackendSrv().fetch<DataSourceResponse>({
      url: `${this.ip}${url}${params?.length ? `?${params}` : ''}`,
    });
    return lastValueFrom(response);
  }



  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to oracle db';
    
    try {

      var hosts = [this.ip];
      hosts.forEach(function(host){
      ping.sys.probe(host, function(isAlive){
      var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
      console.log(msg);
      });
      });

      const response = await this.request('/health');

      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = '';
      if (typeof err === 'string') {
        message = err;
      } else if (isFetchError(err)) {
        message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }


  


}
