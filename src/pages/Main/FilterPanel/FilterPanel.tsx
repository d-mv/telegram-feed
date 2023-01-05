import { ButtonSize, Icon, SecondaryButton } from '../../../shared';
import classes from './FilterPanel.module.scss';

export function FilterPanel() {
  function handleClearFilter() {
    // eslint-disable-next-line no-console
    console.log('clear filter');
  }

  return (
    <div className={classes.container}>
      <SecondaryButton id='cancel-filter' size={ButtonSize.SMALL} onClick={handleClearFilter}>
        <Icon icon='cancelFilter' />
        <span className={classes.text}>Clear</span>
      </SecondaryButton>
    </div>
  );
}
