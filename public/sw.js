const Cache = {
  PREFIX: `cinemaddict-cache`,
  VER: `v1`,
  get NAME() {
    return `${this.PREFIX}-${this.VER}`;
  },
};

const resources =

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(Cache.NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `https://fonts.googleapis.com/css?family=Open+Sans:400,700,800&amp;subset=cyrillic-ext`,
            `./images/background.png`,
            `./images/bitmap.png`,
            `./images/bitmap@2x.png`,
            `./images/bitmap@3x.png`,
            `./images/emoji/angry.png`,
            `./images/emoji/puke.png`,
            `./images/emoji/sleeping.png`,
            `./images/emoji/smile.png`,
            `./images/icons/icon-favorite.svg`,
            `./images/icons/icon-favorite-active.svg`,
            `./images/icons/icon-watched.svg`,
            `./images/icons/icon-watched-active.svg`,
            `./images/icons/icon-watchlist.svg`,
            `./images/icons/icon-watchlist-active.svg`,
            `./images/posters/made-for-each-other.png`,
            `./images/posters/popeye-meets-sinbad.png`,
            `./images/posters/sagebrush-trail.jpg`,
            `./images/posters/santa-claus-conquers-the-martians.jpg`,
            `./images/posters/the-dance-of-life.jpg`,
            `./images/posters/the-great-flamarion.jpg`,
            `./images/posters/the-man-with-the-golden-arm.jpg`,
          ], {mode: `no-cors`});
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      // Получаем все названия кэшей
      caches.keys()
        .then(
            // Перебираем их и составляем набор промисов на удаление
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      // Удаляем только те кэши,
                      // которые начинаются с нашего префикса,
                      // но не совпадают по версии
                      if (key.startsWith(Cache.PREFIX) && key !== Cache.NAME) {
                        return caches.delete(key);
                      }

                      // Остальные не обрабатываем
                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          // Если в кэше нашёлся ответ на запрос (request),
          // возвращаем его (cacheResponse) вместо запроса к серверу
          if (cacheResponse) {
            return cacheResponse;
          }

          // Если в кэше не нашёлся ответ,
          // повторно вызываем fetch
          // с тем же запросом (request)
          // и возвращаем его
          return fetch(request)
            .then((response) => {
              // Если ответа нет, или ответ со статусом отличным от 200 OK,
              // или ответ небезопасного типа (не basic), тогда просто передаём
              // ответ дальше, никак не обрабатываем
              if (!response || response.status !== 200 || response.type !== `basic`) {
                return response;
              }

              // А если ответ удовлетворяет всем условиям, клонируем его
              const clonedResponse = response.clone();

              // Копию кладём в кэш
              caches.open(Cache.NAME)
                .then((cache) => cache.put(request, clonedResponse));

              // Оригинал передаём дальше
              return response;
            });
        })
  );
});
