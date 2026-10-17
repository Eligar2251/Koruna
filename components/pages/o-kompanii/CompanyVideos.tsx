"use client";
import "./design/company.css";
import { useState } from "react";
import { SiteImage } from "../../site/SiteImage";
const videos = [
  [
    "39CS6N4SAJQuyiSLUTvpbE",
    "/_static.tildacdn.com/tild3934-3634-4536-b466-646266333234/photo_2026-03-19_15-.jpg",
  ],
  [
    "hvnquo1KCrXbF2KwTszqci",
    "/_static.tildacdn.com/tild6136-6465-4339-a663-646563636233/photo_2026-02-27_14-.jpg",
  ],
  [
    "omPE8zD2iG8Gx1et73SRfN",
    "/_static.tildacdn.com/tild3532-6563-4430-a538-316633373164/photo_2026-02-27_14-.jpg",
  ],
  [
    "3ghK6UCnLVEs21ztNQWN4e",
    "/_static.tildacdn.com/tild6131-3064-4064-b533-383966343536/photo_2026-02-27_14-.jpg",
  ],
  [
    "2oUyX9HXFAK6wvE4onzcNU",
    "/_static.tildacdn.com/tild3231-6636-4331-a561-343037646462/photo_2026-02-27_14-.jpg",
  ],
  [
    "87FVQ9UMkhjiNA4aoxqiUP",
    "/_static.tildacdn.com/tild6263-6539-4262-b331-633735653761/photo_2026-02-27_14-.jpg",
  ],
];
export function CompanyVideos() {
  const [active, setActive] = useState<string[]>([]);
  return (
    <section className="csb-company-videos" aria-label="Видео компании">
      <div className="csb-company-videos__grid">
        {videos.map(([id, photo], index) => (
          <div className="csb-company-video" key={id}>
            {active.includes(id) ? (
              <iframe
                src={`https://kinescope.io/embed/${id}`}
                title={`Видео компании ${index + 1}`}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
                <SiteImage src={photo} alt="" loading="lazy" decoding="async" />
                <button
                  type="button"
                  aria-label={`Загрузить видео ${index + 1} с Kinescope`}
                  onClick={() => setActive([...active, id])}
                >
                  <span aria-hidden="true">▶</span>
                  <span>Загрузить видео</span>
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="csb-company-videos__note">
        Плеер Kinescope подключается только по нажатию «Загрузить видео». При
        загрузке провайдер получает IP-адрес и технические данные браузера;
        могут использоваться его cookie. Без загрузки видео внешнему сервису
        данные не передаются.
      </p>
    </section>
  );
}
