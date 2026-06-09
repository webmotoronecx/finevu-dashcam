
export interface Article {
  slug: string;
  image: string;
  title: string;
  description: string;
  category: string;
  content?: string; // HTML content or just text for now
  date?: string;
  author?: string;
}

export const articles: Article[] = [
  {
    slug: "4k-vs-2k-dash-cam",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "4K vs 2K: which dash cam is right for you?",
    description: "The GX4K records true 4K, the GX35 records sharp 2K. Here is the plain-English difference, and how to pick the one that suits your driving.",
    category: "Buying Guide",
    date: "May 28, 2026",
    author: "FineVu Team",
    content: `
      <p class="lead">Both the FineVu GX4K and GX35 give you clear, court-ready footage. The real question is how much detail you need, and how often you need to read a number plate from a moving car. Here is how to choose without the marketing fluff.</p>

      <h3>What 4K and 2K actually mean</h3>
      <p>Resolution is just the number of pixels in each frame. 2K (also called Quad HD, 2560 x 1440) is sharper than the 1080p most cheap dash cams record. True 4K (3840 x 2160) packs in roughly four times the pixels of 1080p, which means far more usable detail when you crop in on a plate, a face, or a street sign.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Highway driving at dusk seen through a windscreen" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">More pixels means a plate stays readable even when the car is moving and you crop in.</p>
      </div>

      <h3>The SONY STARVIS difference</h3>
      <p>Resolution is only half the story. Both cameras use SONY STARVIS image sensors, which are built for low light. That is why FineVu footage stays clean at dusk, in tunnels, and on poorly lit suburban streets, where lesser cameras turn to noise and smear. A true 4K sensor with STARVIS gives you both the detail and the light sensitivity to actually use that detail at night.</p>

      <h3>GX4K vs GX35 at a glance</h3>
      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="bg-zinc-100 border-b-2 border-zinc-200">
              <th class="p-4 font-semibold text-zinc-900">Feature</th>
              <th class="p-4 font-semibold text-[var(--finevu-orange)]">GX4K</th>
              <th class="p-4 font-semibold text-[var(--electric-blue)]">GX35</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Front resolution</td>
              <td class="p-4">True 4K (3840 x 2160)</td>
              <td class="p-4">2K (2560 x 1440)</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50/50">
              <td class="p-4 font-medium">Sensor</td>
              <td class="p-4">SONY STARVIS</td>
              <td class="p-4">SONY STARVIS</td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Included storage</td>
              <td class="p-4">128GB</td>
              <td class="p-4">64GB</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50/50">
              <td class="p-4 font-medium">Front &amp; rear (2CH)</td>
              <td class="p-4">Yes</td>
              <td class="p-4">Yes</td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Wi-Fi &amp; GPS app</td>
              <td class="p-4">Yes</td>
              <td class="p-4">Yes</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50/50">
              <td class="p-4 font-medium">Best for</td>
              <td class="p-4">Maximum detail, plate capture</td>
              <td class="p-4">Great value, everyday cover</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Which one should you buy?</h3>
      <ul class="list-none pl-0 space-y-4">
        <li class="flex items-start">
          <span class="mr-3 mt-1 text-[var(--finevu-orange)]">&#10003;</span>
          <div>
            <strong>Choose the GX4K</strong> if you want the sharpest possible evidence, regularly drive on highways, or want the best chance of reading a plate from the next lane. It ships with 128GB, so you get plenty of 4K recording before footage loops.
          </div>
        </li>
        <li class="flex items-start">
          <span class="mr-3 mt-1 text-[var(--finevu-orange)]">&#10003;</span>
          <div>
            <strong>Choose the GX35</strong> if you want excellent, reliable 2K coverage at a sharper price. The same SONY STARVIS sensor technology and 64GB included make it a strong everyday choice for city and commuter driving.
          </div>
        </li>
      </ul>

      <h3>The bottom line</h3>
      <p>There is no wrong answer here. Both are Made in Korea, both carry a 3-Year Australian Warranty, and both come from a brand with 4 million+ units sold worldwide. If detail is everything, go GX4K. If value matters most, the GX35 still outclasses almost everything in its class.</p>
    `
  },
  {
    slug: "how-adas-keeps-you-safer",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "How ADAS keeps you safer",
    description: "Lane departure warnings, forward collision alerts and more. Here is what ADAS does in a FineVu dash cam, and why hardwiring matters.",
    category: "Safety",
    date: "May 14, 2026",
    author: "FineVu Team",
    content: `
      <p class="lead">ADAS stands for Advanced Driver Assistance Systems. In a FineVu dash cam it means your camera does more than record. It actively watches the road and warns you before a mistake becomes a crash.</p>

      <h3>What ADAS actually does</h3>
      <p>Using the front camera and GPS, the dash cam understands lane markings, the car ahead, and your speed. From that it can give you timely audible alerts. These are aids, not autopilot, but a well-timed warning is often all it takes to avoid a low-speed shunt or a lane drift.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Car on an open road from the driver's perspective" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">ADAS alerts are designed to catch the moments your attention slips.</p>
      </div>

      <h3>The key warnings</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Lane Departure Warning (LDWS):</strong> alerts you if you drift out of your lane without indicating, the classic sign of fatigue or distraction.</li>
        <li><strong>Forward Collision Warning (FCWS):</strong> warns you when you are closing on the vehicle ahead too quickly.</li>
        <li><strong>Front Vehicle Start Alarm (FVSA):</strong> a gentle nudge when traffic ahead moves off and you have not, handy at lights.</li>
      </ul>

      <h3>Why hardwiring matters for ADAS</h3>
      <p>ADAS works best with a constant, stable power supply and accurate GPS, which is exactly what a proper hardwire install gives you. Plugging into the cigarette socket only powers the camera while the car is on and can be knocked loose. A hardwire kit draws cleanly from the fuse box, keeps the cabin tidy, and is the same install that unlocks 24/7 parking mode.</p>

      <div class="bg-zinc-50 p-6 rounded-xl border-l-4 border-[var(--finevu-orange)] my-8">
        <h4 class="font-bold text-zinc-900 mb-2">Get it installed properly</h4>
        <p class="text-sm text-zinc-600">A clean hardwire install protects your warranty, keeps wiring out of sight, and makes sure ADAS and parking mode work as intended. Auto Xtreme can point you to a fitter, call 1800 818 288.</p>
      </div>

      <h3>ADAS plus a recording you can trust</h3>
      <p>The real strength of FineVu is that the same SONY STARVIS sensor powering your safety alerts is also capturing the footage. So if a warning is ignored and an incident does happen, you have clear front and rear video, with GPS speed and location, to back up exactly what occurred.</p>

      <h3>The bottom line</h3>
      <p>ADAS will not drive the car for you, but it quietly reduces the small errors that cause most prangs. Paired with a tidy hardwire install, it is one of the most worthwhile features in a modern dash cam.</p>
    `
  },
  {
    slug: "parking-mode-explained",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Parking mode, explained",
    description: "Your car spends most of its life parked. Here is how FineVu parking mode protects it from trolley dents, door dings and hit-and-runs.",
    category: "Features",
    date: "April 30, 2026",
    author: "FineVu Team",
    content: `
      <p class="lead">Most damage to a car happens when nobody is in it. Trolleys in the car park, careless doors, a reverse-and-run. Parking mode keeps your FineVu watching long after you have walked away.</p>

      <h3>What parking mode is</h3>
      <p>When the engine is off, the dash cam switches into a low-power standby state and keeps an eye on the car. If something happens, it wakes up, records the event, and saves it to a separate parking folder so it is easy to find later.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Parked cars on a quiet street at night" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">Parking mode is the cover most people only wish they had after the damage is done.</p>
      </div>

      <h3>How it detects an incident</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Impact (G-sensor):</strong> a bump or knock triggers an instant recording, ideal for trolley dents and door dings.</li>
        <li><strong>Motion detection:</strong> the camera records when someone or something moves into frame near the car.</li>
        <li><strong>Time-lapse:</strong> a continuous low-frame recording of the whole time you were parked, so nothing is missed.</li>
      </ul>

      <h3>Why hardwiring is essential here</h3>
      <p>Parking mode needs power while the engine is off, so it must be hardwired to the fuse box. A FineVu install includes battery protection that cuts power before your car battery gets too low, so you can leave parking mode running overnight without worrying about a flat battery in the morning.</p>

      <h3>Finding the footage later</h3>
      <p>Both the GX4K (128GB) and GX35 (64GB) keep parking events in a dedicated folder. Over Wi-Fi you can open the FineVu app on your phone, scrub to the moment of impact, see the GPS location, and share the clip straight to your insurer or the police, no cables, no card readers.</p>

      <div class="bg-zinc-900 text-white p-8 rounded-2xl my-10 text-center">
        <h3 class="text-2xl font-light mb-4">Always watching, even when you are not</h3>
        <p class="text-zinc-400 mb-8 max-w-2xl mx-auto">Parking mode turns your FineVu into a 24/7 witness. Hardwire it and forget about it.</p>
        <a href="/where-to-buy" class="inline-block px-8 py-4 rounded-full bg-[var(--finevu-orange)] text-white font-bold hover:opacity-90 transition-opacity">
          Where to buy
        </a>
      </div>

      <h3>The bottom line</h3>
      <p>Parking mode is the feature you do not think about until you walk back to a fresh dent with no note. Hardwired and set up once, it quietly protects your car around the clock.</p>
    `
  },
  {
    slug: "front-and-rear-dash-cam",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Why front & rear (2CH) beats front-only",
    description: "Most disputes involve what happened behind you. A 2-channel FineVu records front and rear at once, so you are covered both ways.",
    category: "Buying Guide",
    date: "April 16, 2026",
    author: "FineVu Team",
    content: `
      <p class="lead">A front-only camera tells half the story. Rear-enders, tailgaters and reverse-park bingles all happen behind you, and that is exactly where a single-channel camera is blind. A 2-channel (2CH) FineVu records both ends at once.</p>

      <h3>What 2CH means</h3>
      <p>2CH simply means two cameras working as one system: a main unit on the windscreen and a second camera on the rear glass. Both record continuously to the same memory card, time-synced, so you always have matching front and rear footage of any incident.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="View down a road with traffic ahead" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">The other driver is often behind you. A rear camera makes sure you are not relying on their word.</p>
      </div>

      <h3>The incidents a rear camera catches</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Rear-end collisions:</strong> proves you were stationary or braking lawfully when hit from behind.</li>
        <li><strong>Tailgating and road rage:</strong> records the car riding your bumper, plate and all.</li>
        <li><strong>Reverse parking knocks:</strong> captures the car that backs into you in a car park.</li>
        <li><strong>Lane-change disputes:</strong> shows who was actually where during a merge.</li>
      </ul>

      <h3>Both ends, both clear</h3>
      <p>Because FineVu uses SONY STARVIS sensors front and rear, the rear footage is genuinely usable, not a grainy afterthought. On the GX4K you get true 4K up front with a sharp rear channel, and on the GX35 you get crisp 2K both ways. Either way, a number plate behind you stands a real chance of being readable.</p>

      <h3>Share it in seconds</h3>
      <p>When something happens, open the FineVu app over Wi-Fi, pull both the front and rear clips with their GPS data, and send them to your insurer. No need to hand over your whole memory card or describe what happened, the footage speaks for itself.</p>

      <h3>The bottom line</h3>
      <p>Front-only protects you from what you can already see. A 2CH FineVu protects you from everything else. For the small extra outlay, full front and rear cover is the obvious choice.</p>
    `
  },
  {
    slug: "dash-cam-laws-australia",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Dash cams & insurance in Australia: what to know",
    description: "Dash cams are legal across Australia and footage can make or break a claim. Here is the plain-English rundown for Aussie drivers.",
    category: "Ownership",
    date: "April 2, 2026",
    author: "FineVu Team",
    content: `
      <p class="lead">Good news first: dash cams are legal in every Australian state and territory. The detail worth knowing is how to mount one properly, what your footage can do for an insurance claim, and a few privacy basics. Here is the plain-English version.</p>

      <h3>Are dash cams legal in Australia?</h3>
      <p>Yes. There is no law against fitting or using a dash cam in any Australian state or territory. The main rule across the board is about placement: the camera must not obstruct your view of the road. The safest spot is high on the windscreen, behind the rear-view mirror, where a compact FineVu unit sits neatly out of your sightline.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Driver's view of a road through the windscreen" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">Mount high behind the mirror so the camera never blocks your view of the road.</p>
      </div>

      <h3>How footage helps an insurance claim</h3>
      <p>Insurers love clear evidence because it settles fault quickly. Time-stamped footage with GPS speed and location can:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Prove who was at fault and protect your no-claim bonus.</li>
        <li>Speed up your claim by removing the he-said-she-said.</li>
        <li>Help in hit-and-run cases by capturing the other vehicle's plate.</li>
        <li>Support a not-at-fault claim so you are not wrongly excessed.</li>
      </ul>

      <h3>Privacy, in plain terms</h3>
      <p>Recording on public roads for your own protection is fine. Where to be sensible: audio recording laws vary by state, so many drivers leave the microphone off if carrying passengers who have not consented, and you should not publish footage in a way that harasses or defames someone. For an ordinary driver keeping footage for insurance, none of this is a problem.</p>

      <h3>Get the footage to your insurer fast</h3>
      <p>This is where the FineVu app earns its keep. Over Wi-Fi, you can pull the relevant clip straight to your phone, complete with GPS data, and forward it to your insurer or the police within minutes of an incident, while everything is fresh.</p>

      <div class="bg-zinc-50 p-6 rounded-xl border-l-4 border-[var(--finevu-orange)] my-8">
        <h4 class="font-bold text-zinc-900 mb-2">Peace of mind, backed locally</h4>
        <p class="text-sm text-zinc-600">FineVu is Made in Korea, carries a 3-Year Australian Warranty and is distributed here by Auto Xtreme. Questions on fitting or footage? Call 1800 818 288.</p>
      </div>

      <h3>The bottom line</h3>
      <p>Dash cams are legal, mounting is straightforward, and the footage is genuinely useful when a claim goes sideways. Fit a FineVu properly, keep the microphone setting sensible, and you have an impartial witness on every drive.</p>
    `
  }
];
