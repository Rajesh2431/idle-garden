# Idle Garden Clock — implementation specification

This repository records the complete implementation contract supplied in the build request. The supplied section 6 algorithms are the starting point for `lib/rng.ts`, `lib/weather.ts`, and `lib/sim.ts`; extensions and necessary corrections are documented in DECISIONS.md.

## 1. Product
**Do nothing. The garden grows. Touch it and it holds its breath.** A single-page procedural paper-cut ecosystem grows over real time while the user is away, including when closed. Active time is skipped. Returning visitors see a timeline and before/after report. Required features: deterministic simulation and offline catch-up; presence/shyness; procedural seasonal local-clock canvas; seven weather types; derived critters; milestones; report/swipe; PNG share cards; debug/warp; settings; WebAudio; dynamic favicon/title; installable offline PWA; naming/age/backup; IndexedDB album; optional real weather; read-only shared gardens and OG; single-use seed gifts; server-replayed push; accessibility/performance/error handling; Vercel deployment configuration.

## 2. Stack
Next.js App Router, strict TypeScript, Tailwind, Canvas 2D, pnpm, Vitest. zod, nanoid, @upstash/redis, @upstash/ratelimit, web-push, idb, pako; test/declaration packages. No stock fonts, images, audio. Environment: NEXT_PUBLIC_SITE_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, CRON_SECRET. No committed secrets.

## 3. Core mechanics
TICK_MS=600000; absolute tick=floor(epoch/TICK_MS). Visible + input in last 45000ms means present; skip ticks every frame, never grow. Idle tabs catch up and interpolate tickFraction. Closed-tab catch-up caps at 8640 ticks (60 days). Weather is seeded per six-hour block and season, with stored optional overrides. Critters are derived, never persisted. Pure deterministic core supports server replay.

## 4. Ecosystem
Kinds grass, flower, tree, mushroom, reed; water/soil 0..100. Weather clear, rain, drought, storm, fog, frost, flood. Growth/lifespan/maturity/seed chance: grass 60/6/.6, flower 120/18/.7, tree 4000/430/.9, mushroom 40/5/.8, reed 200/30/.5. Frost tenderness flower/mushroom; flood tenderness flower; drought tenderness all except tree. Mushroom growth doubles at night. Reeds appear by water, trees reproduce, flowers carry hues and optional gifts. First species blooms; rabbits at 20 plants, birds at 40, owl at three mature trees; ring=5 mushrooms in .1 x range; storm/drought/flood/frost; wipe-out below 20% peak; anniversaries 7/30/100 days; gift flower bloom. Each milestone fires once.

## 5. Files
Root AGENTS.md, SPEC.md, DECISIONS.md, CHANGELOG.md, .env.example, vercel.json, README.md. app layout/page/globals/manifest/icon/apple-icon; g/[id]/page and opengraph-image; gift/[code]/page; API garden, garden/[id], gift, gift/[code], push/subscribe, push/sync, push/unsubscribe, cron/tick. Components GardenCanvas, AwayReport, SettingsPanel, AlbumGallery, ShareDialog, GiftDialog, DebugPanel, HintToast, NameBadge. lib rng/types/weather/sim/time/storage/names/realweather/snapshot/audio/album/push/share; server redis/ratelimit/push/replay; render sky/ground/plants/critters/weather-fx/grain/scene. public/sw.js. Tests sim/weather/snapshot/realweather/api/replay.

## 6. Simulation starting point
FNV-style integer hash and mulberry32 from supplied code, clamp. State v1: seed, createdAt, tick, lastPresent, water, soil, nextId, peakPlants, lastWeather, milestones, plants, log. Plant id/kind/x/z/age/hp/hue/seed. Log t/kind/text (weather,bloom,arrival,ring,loss,birth,note). Report ticks/awayMs/newLog/before/after.
Seeded initial six grass; water40 soil30. Spawn clamps nearX offsets ±.06; x/z random, hue flower=(random*360+soil*2)%360 else random*40; random seed. Pick pool grass5, flower2+soil/40, tree.15+soil/400; wet night/fog mushroom3; water>60 reed2. Water deltas clear-.35,rain2.5,drought-1.1,storm3.5,fog.15,frost-.1,flood5. Growth water>15?min(1,water/50):.1; frost*.2,storm*.5. Stress subtracts .04HP; otherwise +.01 capped1. Dead plants enrich soil .4 each and natural deaths reseed at species probability. Natural spawn chance .15*g*(.5+soil/100). Plants cap400, log200. Keep original probabilities. Weather tables: spring clear.4/rain.35/fog.15/storm.07/flood.03; summer clear.45/drought.25/storm.15/rain.1/fog.05; autumn clear.35/rain.3/fog.2/storm.1/flood.05; winter clear.35/frost.35/fog.2/rain.1. RNG hash(seed,block,7). Season months Mar–May spring, Jun–Aug summer, Sep–Nov autumn, otherwise winter. Night before6 or after19. Catch-up clones plant lists, advances monotonically, captures report; markPresent skips. Warp supports signed minutes/hours/days. Save key idle-garden:v1.

## 7. Extensions
GiftInfo from/msg on flowers; name<=24 from seeded 20 adjectives x20 nouns; realWeather record block->weather; lastAlbumSeason. weatherFor uses override then seed. plantGift deterministic hash(seed,hashString(from+msg)) positions and explicit hue, age0 hp1; arrival log. Gift bloom once by plant id. Anniversary once. catchUpAsync batches<=500 with requestIdleCallback/setTimeout and progress; use >2000 ticks. describeGarden plain-language species/weather/critters for screen readers/OG. SEASON_KEY YYYY-season.

## 8. Canvas lifecycle
Boot initWarp, validated load or new garden. Quarantine corrupt raw save under idle-garden:corrupt:<ts> and toast. In-memory fallback persistent note when storage unavailable. Catch-up after weather fetch, progress. Report if away>5min AND events or absolute plant delta>=3. First hint six seconds. Listen mousemove,pointerdown,keydown,wheel,touchstart,scroll. rAF skips while present, catches pending ticks otherwise. Visible idle>5min30fps,>30min10fps. Shy +.15/input max1, decay.4/sec; flee/lean away, audio40% while present, breath text40%. Save every10sec/hidden/pagehide; push beacon max once60sec. Metadata every30sec/weather change: 32px weather favicon, name/status title, aria description. Album season/notable report/anniversary hooks. DPR resize caches. UI badge/name+age upper-left; inline24px SVG bottom-right album/share/seed/settings controls with tooltips; min44px touch; mobile sheets. Chrome idle>10sec opacity25%.

## 9. Render
Sky -> sun/moon/stars -> three seeded paper-cut hills -> pond -> ground -> depth-sorted plants -> critters -> weather -> grain -> vignette. Local-clock dawn/day/dusk/night four-stop seasonal gradient; arcs/twinkle. Cached static layers by season/size. Pond width .05..4 by water, rainy rings, flood overflow. Plant sprite LRU600 key kind/seed/growthBucket0..10/hpBucket0..3/season/night. Grass3–7 blades; flower5–8 petals closes at night, gift halo+tooltip; tree trunk+three blobs autumn color; mushroom spots/night glow; reeds cattails. Cubic easing growth, health desaturation/droop, sway. Hour-seeded critters: day rabbits min(3,floor(n/20)), birds min(5,floor(n/40)); night fireflies<=20 if water>30,frogs>60,owl milestone on tree. Seeded wander, flee cursor/shy. <=250 weather particles; rain/rings, storm flash80ms every5–15sec, radial drifting fog, frost blue/sparkles, drought sepia/shimmer, flood dark tint. Grain256px tile6%overlay; vignette. Reduced motion no flash/shimmer, half particles, half critter speed.

## 10. Away report
Focus-trapped modal/dialog, polite summary, Escape/outside close. Title while you were away; duration hours/minutes or days/hours. Gained/lost, tallest tree, weather/season. Newest-first relative timeline with kind icons; empty quiet copy. Single canvas clipped before/after with fixed sky, draggable divider and keyboard arrows. Enter garden/share card/save postcard.

## 11. Share card
1080x1350 canvas with scene, away duration, three best events, garden name, wordmark/site URL. Blob -> Web Share files when supported else PNG download.

## 12. Real weather
Opt-in; rounded .1degree geolocation stored locally idle-garden:loc; manual lat/lon fallback. Open-Meteo hourly temperature_2m,precipitation,weather_code; past_days7,forecast_days1,timezone auto; verify docs. Six-hour aggregation priority storm WMO95–99; flood precip sum>=30; fog45/48; rain51–67 or80–82; frost71–77 or mean<=2; drought max>=36 and zero precipitation; else clear. Store latest400 blocks. Fetch before boot catch-up, timeout3sec silent seeded fallback; at most hourly. Test all outcomes and thresholds.

## 13. Settings, audio, PWA, backup
Accessible settings slide-over: sound defaultoff/volume (gesture only), motion auto/reduced/full, quality auto/low/high, realweather/location, notifications status, name24chars, install via beforeinstallprompt, validated JSON import with overwrite confirm/export, reset by typing reset. WebAudio master limiter<=40nodes; seasonal 3detuned triangle pad through lowpass with cutoff LFO (spring Cmaj7/summer Lydian add9/autumn Am9/winter Dsus2), bandpass rain noise, lowpass wind+LFO, night4.5kHz crickets, day chirps sweeps, lowpass thunder. 3sec crossfade; presence40%. Manifest standalone generated next/og icons. SW push/click+network-first offline shell.

## 14. Album
idb store {id,t,caption,reason,season,webp Blob,w,h}. 320x400 WebP .7 scene only. Once per season; notable arrival/ring/loss/anniversary report; manual. Cap60, FIFO nonmanual first. Responsive polaroid grid, enlarge/download/delete/share.

## 15. Shared gardens and gifts
All API zod validation, IP sliding-window rates, JSON {ok,...}/{ok:false,error}. Snapshot trims log30 and realweather60blocks -> gzip/base64url; <=100KB, bounded decompression and validated state plants<=400/log<=200/strings<=200. POST garden snapshot/name -> nanoid10 Redis garden:id TTL90days,10/hour/IP; GET id snapshot/404. Shared g/id ghost catch-up, no presence skips/saving/push, visiting banner/age, plant your own/send seed. OG1200x630 JSX-only seasonal scene<=40plants/name/age/count. ShareDialog creates/copies/shares URL. Gift POST from24/msg80/hue0..360 sanitizes controls/angle brackets -> nanoid8 Redis TTL30days10/hour. GET peek; POST atomicGETDEL redeem once. Gift page previews seed/message/hue; plant button redeems then local load/new, plants, saves, returns home with glow. GiftDialog live hue preview/copy/share.

## 16. Push
Gesture permission/registerSW/subscribeVAPID. POST subscribe subscription/snapshot/tzOffsetMin. Hidden/pagehide sendBeacon sync endpoint/snapshot once60sec. Unsubscribe endpoint. Redis push:sha256(endpoint) record subscription,snapshot,tzOffsetMin,lastNotifiedLogT,lastPushAt TTL120days + push:index. Authenticated cron Bearer CRON_SECRET loads<=500, replay only lastPresent older5min. Eligible arrival/ring/loss/bloom/weather storm/flood/anniversary; queue through quiet23–07 local by offset or throttle3hours. Send max3 joined lines title the garden has news/url /. On404/410delete. Persist replay and notification cursor without losing queued events. Test client/server equivalence. SW showNotification icon/badge, focus/open URL. vercel */30 * * * *; Hobby daily-only, external scheduler fallback; verify docs.

## 17. Debug
?debug=1 buttons +1h/+6h/+1d/+7d/+30d, reset/newseed/testgift/postcard/lightning/forceweather/testpush; readouts seed,tick,water,soil,counts,weather,season,fps,particlecount,spritecache,storagebytes. Warp signed m/h/d shifts app clock everywhere.

## 18. Phases
0 scaffold/tooling/folders/env/decisions/changelog; 1 core/extensions/names/time/snapshot/tests; 2 static canvas/cache/debug; 3 loop/presence/persistence/recovery; 4 critters/weather/shy/reducedmotion; 5 report/swipe/PNG/hint/async; 6 settings/audio/meta/PWA/name/backup; 7 album/triggers/cap; 8 realweather/location/tests; 9 sharing/gifts/API/Redis/OG; 10 push/replay/cron/quiet; 11 accessibility/performance/errors/Lighthouse; 12 Vercel config/README/manualchecklist. Each phase run lint, tsc --noEmit, vitest run, build; fix failures, commit phase N: name. If still failing after3fixattempts record failure and continue independent work.

## 19. Tests
sim determinism/8640cap/milestoneonce/400plants/200logs/presenceskip/giftbloom/7-30-100anniversaries/async equivalence; weather seed+block/tables sum1/override; realweather allmapping fixtures inclthresholds; snapshot roundtrip/100KB/malformed/bounds; API giftcreate-peek-redeem-second404/sanitize/rate429 mockedRedis; replay equivalent/quiet/throttle/410 cleanup mockedwebpush.

## 20. Acceptance
Fresh6grass+hint+noconsoleerrors; revisit+8h report>=1event/growth/swipe pointer-touch-keyboard; +30d async nofreeze; input stops growth,45sec resumes; deterministic client/server; <=400plants/200logs/200KBsave/60cards;60fps400plants midphone+battery throttle; sharedghost+OG/single-usegifts; deliveredtestpush/quiet/deadcleanup; weather offline/denied fallback; reducedmotion/keyboard/textsummary; mobile Lighthouse perf>=90/a11y>=95/installable; lint/typecheck/test/build green. Do not claim device/cloud verification without evidence.

## 21. Deploy/manual
CreateUpstash and envREST URL/token; npx web-push generate-vapid-keys and public/private/subject env; random32+char CRON_SECRET/siteURL; npx vercel link/addenv/npx vercel --prod; Pro30mincron/Hobby external Bearer scheduler; realphone PWA install/notifications/closedpush. iOS webpush requires home-screen installation.

## 22. Copy
Quiet, patient, melancholy-warm; lowercase UI, short, no exclamation marks. leave this tab. come back later. / the garden is holding its breath. / while you were away / quiet. everything just grew a little. / a seed from <name> / the garden has news / plant it.

## 23. Definition of done
All features work; tests and acceptance verified; README setup; final report built features, run commands, environment and manual steps. State external/sandbox/device verification limits explicitly.
