import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
