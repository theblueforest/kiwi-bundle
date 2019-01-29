import { History } from 'history';
import { WebComponent } from "./components";
declare class Route {
    name: string;
    path: string;
    component: typeof WebComponent;
    constructor(name: string, path: string, component: typeof WebComponent);
}
declare class Router {
    routes: Route[];
    history: History;
    paths: {
        [name: string]: string;
    };
    constructor(routes?: Route[]);
    getRoutePath(name: string): string;
    render(): JSX.Element;
}
export { Router as default, Route, };
