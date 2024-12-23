import BlockquoteWithoutImage from './whtoutImage';
import BlockquoteWithImage from './withImage';

export type BlockquoteProps = {
  author: {
    name: string;
    role: string;
  };
  children: React.ReactNode;
  className?: string;
  image?: string;
};

export function Blockquote(props: BlockquoteProps) {
  if (props.image) {
    return <BlockquoteWithImage {...props} />;
  }

  return <BlockquoteWithoutImage {...props} />;
}
