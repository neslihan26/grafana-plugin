import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData } = options;

  const onIPChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        ip: event.target.value,
      },
    });
  };

  const onPortChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        port: event.target.value,
      },
    });
  };
  const onUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        user: event.target.value,
      },
    });
  };
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        password: event.target.value,
      },
    });
  };


  return (
    <>
      <InlineField label="IP" labelWidth={20} interactive tooltip={'Oracledb 19c ip address'}>
        <Input
          required
          id="config-editor-ip"
          onChange={onIPChange}
          value={jsonData.ip}
          placeholder="Enter Oracledb 19c ip address"
          width={40}
        />
      </InlineField>
      <InlineField label="Port" labelWidth={20} interactive tooltip={'Oracledb 19c port'}>
        <Input
          required
          id="config-editor-port"
          onChange={onPortChange}
          value={jsonData.port}          
          placeholder="Oracledb 19c port"
          width={40}         
        />
      </InlineField>
      <InlineField label="User" labelWidth={20} interactive tooltip={'Oracledb 19c user'}>
        <Input
          required
          id="config-editor-user"
          onChange={onUserChange}
          value={jsonData.user}          
          placeholder="Oracledb 19c user"
          width={40}         
        />
      </InlineField>
      <InlineField label="Password" labelWidth={20} interactive tooltip={'Oracledb 19c password'}>
        <Input
          required
          id="config-editor-password"
          onChange={onPasswordChange}
          value={jsonData.password}          
          placeholder="Oracledb 19c password"
          width={40}         
        />
      </InlineField>
    </>
    
  );
}
