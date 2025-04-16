import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material'; // MUI components

import 'react-datepicker/dist/react-datepicker.css';

import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import ProcessInstanceListTableWithFilters from '../components/ProcessInstanceListTableWithFilters';
import {
  getProcessModelFullIdentifierFromSearchParams,
  setPageTitle,
} from '../helpers';
import ProcessInstanceListTabs from '../components/ProcessInstanceListTabs';

type OwnProps = {
  variant: string;
};

export default function ProcessInstanceList({ variant }: OwnProps) {
  const [searchParams] = useSearchParams();
  setPageTitle(['Instâncias dos Processos']);

  const processInstanceBreadcrumbElement = () => {
    const processModelFullIdentifier =
      getProcessModelFullIdentifierFromSearchParams(searchParams);
    if (processModelFullIdentifier === null) {
      return null;
    }

    return (
      <ProcessBreadcrumb
        hotCrumbs={[
          ['Grupos de Processo', '/process-groups'],
          {
            entityToExplode: processModelFullIdentifier,
            entityType: 'process-model-id',
            linkLastItem: true,
          },
          ['Instâncias dos Processos'],
        ]}
      />
    );
  };

  const processInstanceTitleElement = () => {
    let headerText = 'Minhas Instâncias dos Processos';
    if (variant === 'all') {
      headerText = 'Todas as Instâncias dos Processos';
    }
    return { text: headerText };
  };

  return (
    <Box>
      <ProcessInstanceListTabs variant={variant} />
      <br />
      {processInstanceBreadcrumbElement()}
      <ProcessInstanceListTableWithFilters
        variant={variant}
        showActionsColumn
        header={processInstanceTitleElement()}
      />
    </Box>
  );
}
