import { CSSProperties, PropsWithoutRef } from 'react';
import { MdDeleteOutline, MdOutlineError } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { TiInfoLarge, TiArrowUp } from 'react-icons/ti';
import { IoClose, IoWarning, IoReturnUpBack } from 'react-icons/io5';
import { BsFillHandThumbsUpFill, BsFileImage, BsCameraVideo } from 'react-icons/bs';
import { BiShow, BiHide, BiRadioCircle } from 'react-icons/bi';
import { FiEye, FiDownloadCloud } from 'react-icons/fi';
import { TfiControlForward, TfiCommentAlt } from 'react-icons/tfi';
import { TbFilterOff } from 'react-icons/tb';
import { RxDividerHorizontal } from 'react-icons/rx';
import { CgMenu } from 'react-icons/cg';
import { RiCheckboxBlankCircleLine, RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { makeMatch } from '@mv-d/toolbelt';

export const Icons = makeMatch(
  {
    delete_outlined: MdDeleteOutline,
    user: FaUser,
    menu: CgMenu,
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
    image: BsFileImage,
    up: TiArrowUp,
    video: BsCameraVideo,
    download: FiDownloadCloud,
    comment: TfiCommentAlt,
    checkbox: RiCheckboxBlankCircleLine,
    checkboxChecked: RiCheckboxBlankCircleFill,
  },
  () => <div />,
);

export interface IconProps {
  icon: keyof typeof Icons;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Icon({ icon, className, style, id }: PropsWithoutRef<IconProps>) {
  const Icon = Icons[icon];

  return <Icon id={id} className={className} style={style} />;
}
