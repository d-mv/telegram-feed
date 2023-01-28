import classes from './ProgressIndicator.module.scss';

interface ProgressIndicatorProps {
  progress: number;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className={classes.container}>
      <div className={classes.bar} style={{ width: `${progress}%` }}></div>
    </div>
  );
}
