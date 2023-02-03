import { makeMatch } from '@mv-d/toolbelt';
import { useRecoilValue } from 'recoil';

import { LazyLoad, modalState } from '../../shared';
import { Filter, FilterCounter, FilterActions } from '../filter';
import { Modal } from './Modal';

const MODAL_CONTENTS = makeMatch(
  { filter: { Component: Filter, footer: FilterActions, widgets: { header: FilterCounter } } },
  { component: () => null },
);

export default function Modals() {
  const modalId = useRecoilValue(modalState);

  if (!(modalId in MODAL_CONTENTS)) return null;

  const { Component, widgets, footer } = MODAL_CONTENTS[modalId];

  return (
    <LazyLoad>
      <Modal widgets={widgets} footer={footer}>
        <Component />
      </Modal>
    </LazyLoad>
  );
}
