import { useState } from 'react';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import ProcessGroupForm from '../components/ProcessGroupForm';
import { ProcessGroup, HotCrumbItem } from '../interfaces';
import { setPageTitle } from '../helpers';

export default function ProcessGroupNew() {
  const searchParams = new URLSearchParams(document.location.search);
  const parentGroupId = searchParams.get('parentGroupId');
  const [processGroup, setProcessGroup] = useState<ProcessGroup>({
    id: '',
    display_name: '',
    description: '',
  });
  setPageTitle(['Novo Grupo de Processos']);

  const hotCrumbs: HotCrumbItem[] = [['Grupo de Processos', '/process-groups']];
  if (parentGroupId) {
    hotCrumbs.push({
      entityToExplode: parentGroupId,
      entityType: 'process-group-id',
      linkLastItem: true,
    });
  }

  return (
    <>
      <ProcessBreadcrumb hotCrumbs={hotCrumbs} />
      <h1>Adicionar Grupo de Processos</h1>
      <ProcessGroupForm
        mode="new"
        processGroup={processGroup}
        setProcessGroup={setProcessGroup}
      />
    </>
  );
}
