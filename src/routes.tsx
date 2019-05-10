import React from "react";
import categories from './components/Categories/routes';
import users from './components/Users/routes';
import login from './components/Login/routes';
import reader from './components/Reader/routes';
import classic_scripts from './components/ClassicScript/routes';
import {AppRoutingMap, ScreenRoute} from "./types";

class RoutesMap implements AppRoutingMap{
    map: {[key: string]: ScreenRoute} = {};

    add = (routes: ScreenRoute[]) => {
        routes.forEach((r) => {
            this.map[r.name] = r;
        })
    }
}

const map = new RoutesMap();

const defaultRoutesDefs = [
    { name: 'home', path: '/' },
    { name: 'not_found', path: '/not_found'},
    { name: 'users', path: '/users' },
    { name: 'posting', path: '/posting' },
    { name: 'categories', path: '/categories' },
    { name: 'category', path: '/category'},
    { name: 'category.id', path: '/:id'}
];

map.add(defaultRoutesDefs);
map.add(categories);
map.add(users);
map.add(login);
map.add(classic_scripts);
map.add(reader);

export const publicRoutes = () => {
  return [
      'login', 'reader', 'not_found'
  ]
};


export default map;