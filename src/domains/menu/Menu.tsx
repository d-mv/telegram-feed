import { useResetRecoilState } from 'recoil';
import { useLogout } from '../../shared';

import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';
import { menuIsOpenState } from './menu.store';
import { MenuButton } from './MenuButton';

const MENU_ITEMS = [{ id: 'logout', title: 'Log out' }];

export function Menu() {
  const closeMenu = useResetRecoilState(menuIsOpenState);

  const { logOut } = useLogout();

  function handleItemClick(id: string) {
    return function onClick() {
      closeMenu();

      if (id === 'logout') logOut();
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
