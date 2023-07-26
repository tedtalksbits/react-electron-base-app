type MainLayoutProps = {
  children: React.ReactNode;
};
function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <a href="/">Decks</a>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

export default MainLayout;
