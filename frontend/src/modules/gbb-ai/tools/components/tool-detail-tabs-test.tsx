import { OpenAPIV3 } from 'openapi-types';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';

import TesterRequest from './tool-detail-tabs-test-request';
import TesterResponse from './tool-detail-tabs-test-response';

// ----------------------------------------------------------------------

type Props = {
  methods?: any;
};

export default function ToolDetailTestTab({ methods }: Props) {
  const { watch, setValue } = methods;

  const values = watch();

  const { code, type, params, response, apiAuth, entryFunction } = values;

  useEffect(() => {
    if (type === 'Python') {
      const functionParams = getFunctionParams(code, type, entryFunction);
      if (functionParams && JSON.stringify(functionParams) !== JSON.stringify(params)) {
        setValue(
          'params',
          functionParams.map((funcParam) => {
            const param = params.find((p: any) => p.name === funcParam.name);
            return { ...funcParam, value: param ? param.value : '' };
          })
        );
      }
    } else {
      const apiParams = getOpenAPIParams(code, type, entryFunction);
      if (!apiParams || apiParams?.length === 0) return;

      if (apiParams && JSON.stringify(apiParams) !== JSON.stringify(params)) {
        const { url, method, path, parameters, requestBody } = apiParams[0];

        const convertedParams = parameters.map((param: any) => {
          const existingParam = params.find((p: any) => p.name === param.name);
          return {
            name: param.name,
            type: param.schema.type,
            value: existingParam ? existingParam.value : '',
            required: param.required,
          };
        });

        // Assuming requestBody has a similar structure and handling as parameters
        let requestBodyValue = { name: 'requestBody', type: '', value: '', required: false };
        if (requestBody && requestBody.schema) {
          const existingRequestBody = params.find((p: any) => p.name === 'requestBody');
          let parsedRequestBody: any = null;
          try {
            if (existingRequestBody) parsedRequestBody = JSON.parse(existingRequestBody.value);
          } catch (error) {
            console.error(error);
          }

          const { properties } = requestBody.schema;
          const reformattedProperties = Object.keys(properties).reduce<Record<string, string>>(
            (acc, propertyName) => {
              const value = parsedRequestBody ? parsedRequestBody[propertyName] : '';
              acc[propertyName] = value;
              return acc;
            },
            {}
          );

          requestBodyValue = {
            name: 'requestBody',
            type: requestBody.contentType,
            value:
              Object.keys(properties).length > 0
                ? JSON.stringify(reformattedProperties, null, 2)
                : '',
            required: requestBody.required !== undefined ? requestBody.required : true,
          };
        }

        setValue('params', [
          { name: 'url', type: 'string', value: url },
          { name: 'method', type: 'string', value: method },
          { name: 'path', type: 'string', value: path },
          requestBodyValue,
          ...convertedParams,
        ]);
      }
    }
    // eslint-disable-next-line
  }, [code, type, setValue, entryFunction]);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleUpdateParams = (index: number, data: string) => {
    setValue(
      'params',
      values.params.map((item: { name: string; type: string; value: string }, i: number) =>
        i === index ? { ...item, value: data } : item
      )
    );
  };

  const handleUpdateResponse = (data: string) => {
    setValue('response', data);
  };

  return (
    <Grid container spacing={{ xs: 0.5, md: 3 }} sx={{ mb: { xs: 8, md: -12 } }}>
      <Grid item xs={12} md={6} lg={6} sx={{ height: 'calc(100vh - 342px)' }}>
        <TesterRequest
          codeType={type}
          entryFunction={entryFunction}
          params={params}
          onUpdateParams={handleUpdateParams}
          onUpdateResponse={handleUpdateResponse}
          onSetLoadingResponse={setLoadingResponse}
          apiAuth={apiAuth}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={6} sx={{ height: 'calc(100vh - 342px)' }}>
        <TesterResponse loadingResponse={loadingResponse} response={response} />
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------

function getFunctionParams(functionString: string, codeType: string, entryFunction: string) {
  const regex = new RegExp(`def ${entryFunction}\\((.*?)\\)`);
  const match = functionString.match(regex);

  if (!match || match[1] === '') {
    return [];
  }
  const parameters = match
    ? match[1].split(',').map((param) => {
        const parts = param
          .trim()
          .split(':')
          .map((str) => str.trim());
        const typeOrValue = parts[1];
        let name = parts[0];
        let type;
        let defaultValue;
        if (name.includes('=')) {
          [name, defaultValue] = name.split('=').map((str) => str.trim());
          type = undefined;
        } else if (typeOrValue) {
          if (typeOrValue.includes('=')) {
            [type, defaultValue] = typeOrValue.split('=').map((str) => str.trim());
          } else {
            type = typeOrValue;
          }
        }
        return { name, type, defaultValue };
      })
    : [];

  return parameters;
}

function getOpenAPIParams(functionString: string, codeType: string, entryFunction: string) {
  try {
    const schema = parseOpenAPISchema(functionString);

    if (!schema) {
      console.error('Invalid OpenAPI schema. Exiting.');
      return null;
    }

    // Extract API details from the schema
    const apiDetails = extractApiDetails(schema);
    return apiDetails;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to parse the JSON string
function parseOpenAPISchema(jsonString: string): OpenAPIV3.Document | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse OpenAPI schema:', error);
    return null;
  }
}

function isHttpMethod(method: string): method is keyof OpenAPIV3.PathItemObject {
  return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method);
}

function extractApiDetails(schema: OpenAPIV3.Document) {
  const apiDetails: any[] = [];
  const serverUrl = schema.servers?.[0]?.url || '';

  try {
    Object.keys(schema.paths).forEach((path) => {
      const pathItem = schema.paths[path] as OpenAPIV3.PathItemObject;

      Object.keys(pathItem).forEach((method) => {
        if (isHttpMethod(method)) {
          const operation = pathItem[method] as OpenAPIV3.OperationObject;

          const parameters =
            operation.parameters?.map((param) => {
              const parameter = param as OpenAPIV3.ParameterObject;
              return {
                name: parameter.name,
                in: parameter.in,
                required: parameter.required,
                schema: parameter.schema,
              };
            }) || [];

          // Extract requestBody details
          let requestBodyDetails = {};
          if (operation.requestBody) {
            const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;
            const { content } = requestBody;
            const [contentType, contentDetails] = Object.entries(content)[0];
            requestBodyDetails = {
              contentType,
              schema: contentDetails.schema,
            };
          }

          apiDetails.push({
            path,
            method,
            parameters,
            requestBody: requestBodyDetails, // Add requestBody details here
            url: `${serverUrl}${path}`,
          });
        }
      });
    });
  } catch (error) {
    console.error('Failed to extract API details:', error);
  }

  return apiDetails;
}
