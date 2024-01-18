import React from 'react';
import { Link } from 'react-router-dom';

type props = {
  to: string;
  children: React.ReactNode;
};

export const StyledLink: React.FC<props> = ({ to, children }) => (
  <Link style={{ textDecoration: 'none', color: 'inherit'}} to={to}>
    {children}
  </Link>
);