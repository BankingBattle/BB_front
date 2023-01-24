import { NavLink, NavLinkProps } from 'react-router-dom';

export const A = (props: NavLinkProps) => (
  <NavLink
    className="text-purple-500 hover:text-purple-600 transition-colors"
    {...props}
  />
);
