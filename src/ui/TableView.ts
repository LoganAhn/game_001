/**
 * 포커 테이블 DOM 생성
 */
export function createTableElement(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'poker-table-wrapper';

  const table = document.createElement('div');
  table.className = 'poker-table';

  const felt = document.createElement('div');
  felt.className = 'poker-table-felt';

  // Community cards area (felt 위에 위치)
  const communityArea = document.createElement('div');
  communityArea.className = 'community-area';
  communityArea.id = 'community-area';

  felt.appendChild(communityArea);
  table.appendChild(felt);
  wrapper.appendChild(table);

  return wrapper;
}
