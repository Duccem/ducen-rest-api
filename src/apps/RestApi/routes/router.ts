import { Router } from 'express';
import glob from 'glob';
import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';

export function registerRoutes(router: Router, repo: Repository, bus: EventBus) {
  const routes = glob.sync(__dirname + '/**/*.routes.*');
  routes.map(route => register(route, router, repo, bus));
}

function register(routePath: string, router: Router, repo: Repository, bus:EventBus) {
    const route = require(routePath);
    route.register(router, repo, bus);
}