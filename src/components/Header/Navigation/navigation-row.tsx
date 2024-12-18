import { Container } from '../../Container';

function NavigationRow({ children }: { children: React.ReactNode }) {
  return (
    <div className='even:mt-px sm:bg-neutral-950'>
      <Container>
        <div className='grid grid-cols-1 sm:grid-cols-2'>{children}</div>
      </Container>
    </div>
  );
}

export { NavigationRow };
