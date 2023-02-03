import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { modalState, useLogout } from '../../shared';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';
import { menuIsOpenState } from './menu.store';
import { MenuButton } from './MenuButton';

const MENU_ITEMS = [
  { id: 'filter', title: 'Filter' },
  { id: 'logout', title: 'Log out' },
];

export function Menu() {
  const closeMenu = useResetRecoilState(menuIsOpenState);

  const setModalId = useSetRecoilState(modalState);

  const { logOut } = useLogout();

  function handleItemClick(id: string) {
    return function onClick() {
      closeMenu();

      if (id === 'logout') logOut();
      else if (id === 'filter') setModalId('filter');
    };
  }

  function renderItem({ id, title }: { id: string; title: string }) {
    return <DropdownItem key={id} title={title} onClick={handleItemClick(id)} />;
  }

  return (
    <>
      <MenuButton />
      <Dropdown>{MENU_ITEMS.map(renderItem)}</Dropdown>
    </>
  );
}
