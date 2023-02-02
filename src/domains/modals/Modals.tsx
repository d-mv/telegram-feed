import { makeMatch } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';

import { LazyLoad } from '../../shared';
import { Filter } from '../filter';
import { Modal } from './Modal';
import { modalState } from './modals.store';

const MODAL_CONTENTS = makeMatch({ filter: Filter }, () => null);

export default function Modals() {
  const modalId = useRecoilValue(modalState);

  const Component = MODAL_CONTENTS[modalId];

  if (!Component) return null;

  return (
    <Modal>
      <LazyLoad>
        <Component />
      </LazyLoad>
    </Modal>
  );
}
