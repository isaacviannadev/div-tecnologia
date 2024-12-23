'use client';

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const MotionImage = motion(Image);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GrayscaleTransitionImage(props: any) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 35%'],
  });
  const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
  const filter = useMotionTemplate`grayscale(${grayscale})`;

  return (
    <div ref={ref} className='group relative'>
      <MotionImage alt='' style={{ filter }} {...props} />
      <div
        className='pointer-events-none absolute left-0 top-0 w-full opacity-0 transition duration-300 group-hover:opacity-100'
        aria-hidden='true'
      >
        <Image alt='' {...props} />
      </div>
    </div>
  );
}
