import { matchPath, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const { pathname } = useLocation();

  // console.log(pathname.split("/").slice(0, 3).join("/"));
  const shrinkedPath = pathname.split("/").slice(0, 3).join("/");

  const normalActive = path ? !!matchPath({ path, end: false }, pathname) : false;
  // const normalActive = path ? !!matchPath({ path, end: true }, shrinkedPath) : false;

  const deepActive = path ? !!matchPath({ path, end: false }, shrinkedPath) : false;

  return deep ? deepActive : normalActive;
}
