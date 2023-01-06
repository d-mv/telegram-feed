import { PropsWithoutRef } from 'react';
import { MdDeleteOutline, MdOutlineError } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { TiInfoLarge, TiThMenu } from 'react-icons/ti';
import { IoClose, IoWarning, IoReturnUpBack } from 'react-icons/io5';
import { BsFillHandThumbsUpFill } from 'react-icons/bs';
import { BiShow, BiHide, BiRadioCircle } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { TfiControlForward } from 'react-icons/tfi';
import { TbFilterOff } from 'react-icons/tb';
import { RxDividerHorizontal } from 'react-icons/rx';
import { makeMatch } from '@mv-d/toolbelt';

export const Icons = makeMatch(
  {
    delete_outlined: MdDeleteOutline,
    user: FaUser,
    menu: TiThMenu,
    info: TiInfoLarge,
    close: IoClose,
    error: MdOutlineError,
    warn: IoWarning,
    success: BsFillHandThumbsUpFill,
    hide: BiHide,
    show: BiShow,
    eye: FiEye,
    forward: TfiControlForward,
    cancelFilter: TbFilterOff,
    return: IoReturnUpBack,
    dividerH: RxDividerHorizontal,
    radioCircle: BiRadioCircle,
  },
  () => <div />,
);

export interface IconProps {
  icon: keyof typeof Icons;
  className?: string;
}

export function Icon({ icon, className }: PropsWithoutRef<IconProps>) {
  const Icon = Icons[icon];

  return <Icon className={className} />;
}
