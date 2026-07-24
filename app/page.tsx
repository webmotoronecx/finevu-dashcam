"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { LearnMoreLinks } from '@/components/LearnMoreLinks';
import { ScrollProgress } from '@/components/ScrollProgress';
import { articles } from '@/lib/data/articles';
import {
  Star, Play,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

// Section heading: Inter Bold 48/52, #0b0b0c (Figma H1 usage)
const HEAD = 'text-[#0b0b0c] font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.08] lg:leading-[52px] tracking-tight';
// Body / subtitle: Inter Regular 18/27, #5c6478
const SUB = 'text-[#5c6478] text-base lg:text-[18px] leading-[27px]';

/* Hero */
function Hero({
  theme, image, video, eyebrow, title, sub, href,
}: {
  theme: 'dark' | 'light';
  image: string;
  video?: string;
  eyebrow: string;
  title: string;
  sub: string;
  href: string;
}) {
  const dark = theme === 'dark';
  const text = dark ? 'text-white' : 'text-[#0b0b0c]';
  // Video frames vary frame-to-frame, so guarantee legibility with a text shadow.
  const shadow = video ? ' [text-shadow:0_2px_18px_rgba(0,0,0,0.7)]' : '';
  return (
    <section
      className="relative w-full overflow-hidden m:aspect-[2160/1245] min-h-screen"
      data-nav-theme={theme}
    >
      {video ? (
        // Background video: autoplay/muted/loop for iOS, poster acts as fallback
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={image}
          aria-hidden="true"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      {video && (
        // Readability scrim so overlaid copy stays legible over the video.
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20" />
      )}
      <div className="absolute inset-x-0 top-[55%] -translate-y-50 md:top-[15.1%] md:translate-y-0 flex flex-col items-center text-center px-6">
        <motion.p
          className={`${text}${shadow} font-bold text-[11.5px] leading-[17px] tracking-[0.28em] uppercase`}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          className={`${text}${shadow} font-bold uppercase text-5xl sm:text-6xl lg:text-[80px] leading-[1.04] lg:leading-[83px] tracking-[-0.01em] mt-[14px]`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className={`${dark ? 'text-white' : 'text-[#0b0b0c]'}${shadow} text-base lg:text-[18px] leading-[30px] max-w-[470px] mt-6`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          <Link
            href={href}
            className={`cta-hover inline-flex items-center justify-center w-[214px] h-12 rounded-full text-[14px] font-semibold uppercase leading-[20px] ${
              dark
                ? 'border border-white/70 text-white bg-white/5 hover:bg-white/10'
                : 'border border-[#0b0b0c]/55 text-[#0b0b0c] hover:bg-[#0b0b0c]/5'
            }`}
          >
            Explore
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* More reasons bento */
const reasons = [
  { img: '/home/No.1_Banner.webp', label: 'No.1 Dash Cam in Korea' },
  { img: '/home/3YearWarranty_Tile.webp', label: '3 Year Warranty', sup: '1' },
  { img: '/home/reason-microsd.jpg', label: 'Includes 64GB & 128GB MicroSD Card', sup: '2' },
  { img: '/home/reason-hardwire.jpg', label: 'Includes Hardwire Kit & Power Cable', sup: '3' },
];

function ReasonCard({ img, label, sup, aspect }: { img: string; label: string; sup?: string; aspect: string }) {
  return (
    <div className={`tile-hover relative overflow-hidden rounded-[20px] ${aspect}`}>
      <ImageWithFallback src={img} alt={label} className="absolute inset-0 w-full h-full object-cover" />
      <p className="absolute inset-x-0 bottom-6 text-center text-white font-bold text-[17px] px-4">
        {label}
        {sup && <sup className="text-[11px] font-medium ml-0.5 top-[-0.6em]">[{sup}]</sup>}
      </p>
    </div>
  );
}

/* Reviews */
const reviews = [
  {
    thumb: '/products/gx4k-studio.jpg', product: 'FineVu GX4K', tagline: 'Very user friendly',
    body: "I was surprised by the quality of the video, super good in day and especially better in night! The camera doesn't overheat, and the mobile app is very user friendly, easy to change the settings and download the files I require.",
  },
  {
    thumb: '/products/gx35-studio.jpg', product: 'FineVu GX35', tagline: 'Video recording was extremely clear',
    body: 'Really compact and the video recording was extremely clear. Value for money as well',
  },
  {
    thumb: '/products/gx4k-studio.jpg', product: 'FineVu GX1000', tagline: 'Easy to navigate the app and program',
    body: 'I am very satisfied with my product GX1000. Great quality. Easy to navigate the app and program. Reliable brand with excellent after sales service. Best parts is able inform speed camera. Value for money.',
  },
];

/* Disclaimers */
const disclaimers = [
  { n: 1, title: 'Warranty', body: '3 Year Warranty applies to FineVu dash cam main units only, including front and rear cameras, for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6 month warranty. Proof of purchase required. Full warranty terms apply. Your rights under the Australian Consumer Law are not excluded.' },
  { n: 2, title: 'SD Cards', body: 'GX35 includes a FineVu 64GB MicroSD Card and Adapter. GX4K includes a FineVu 128GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered by a 6 month warranty.' },
  { n: 3, title: 'Hardwire Kit & Power Cable', body: 'GX35 and GX4K include a Hardwire Kit and Power Cable. Included Hardwire Kits and Power Cables are covered by a 6 month warranty.' },
];

export default function Page() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 460, behavior: 'smooth' });
  };
  const exploreItems = articles.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />

      {/* Hero — GX4K (dark cosmic) */}
      <Hero
        theme="dark"
        image="/home/hero-gx4k.jpg"
        video="/home/GX4K_Hero_Video_V2.mp4"
        eyebrow="FineVu GX4K · 2-Channel UHD"
        title="GX4K"
        sub="The clearest view of the road you've ever recorded - front and rear."
        href="/gx4k"
      />

      {/* Hero — GX35 (video; white text over a readability scrim) */}
      <Hero
        theme="dark"
        image="/home/hero-gx35.jpg"
        video="/home/GX35_Hero_Video_v2.mp4"
        eyebrow="FineVu GX35 2k · 2-Channel 2k QHD"
        title="GX35"
        sub="QHD 2K clarity in a camera smaller than a credit card - now with a live view of your car from anywhere in the world."
        href="/gx35"
      />

      {/* More reasons to choose FineVu — bento */}
      <section className="bg-[#f7f7f7] py-16 md:py-24" data-nav-theme="light">
        <div className="max-w-[1340px] mx-auto px-6">
          <motion.h2 className={`${HEAD} text-center mb-12`} {...fadeUp}>
            More reasons to choose FineVu.
          </motion.h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-[730fr_550fr] gap-5 mb-5" {...fadeUp}>
            <ReasonCard {...reasons[0]} aspect="aspect-[730/600]" />
            <ReasonCard {...reasons[1]} aspect="aspect-[550/600]" />
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5" {...fadeUp}>
            <ReasonCard {...reasons[2]} aspect="aspect-[640/400]" />
            <ReasonCard {...reasons[3]} aspect="aspect-[640/400]" />
          </motion.div>
        </div>
      </section>

      {/* We'll come to you */}
      <section className="bg-[#f7f7f7] pb-16 md:pb-24" data-nav-theme="light">
        <div className="max-w-[1705px] mx-auto px-6 text-center">
          <motion.h2 className={HEAD} {...fadeUp}>We&apos;ll come to you</motion.h2>
          <motion.p className={`${SUB} max-w-[660px] mx-auto mt-4`} {...fadeUp}>
            Book a FineVu mobile installer to fit your dash cam at home or work, fully hardwired, fully tested, fully covered.
          </motion.p>
          <motion.div className="mt-8" {...fadeUp}>
            <Link
              href="/installation"
              className="cta-hover inline-flex items-center justify-center h-12 px-9 rounded-full bg-[var(--finevu-orange)] text-white text-[14px] font-semibold uppercase leading-[20px]"
            >
              Book Installation
            </Link>
          </motion.div>
          <motion.div className="mt-10 overflow-hidden rounded-[24px]" {...fadeUp}>
            <ImageWithFallback
              src="/home/hero-book.webp"
              alt="A FineVu mobile installer at a customer's home"
              className="w-full h-auto object-cover aspect-[2688/1000] object-middle"
           
            />
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#f7f7f7] pb-16 md:pb-24" data-nav-theme="light">
        <div className="max-w-[1340px] mx-auto px-6">
          <motion.div className="text-center max-w-[760px] mx-auto mb-14" {...fadeUp}>
            <h2 className={HEAD}>Discover how other users<br className="hidden sm:block" /> feel about our dashcams.</h2>
            <p className={`${SUB} mt-5`}>
              Built by FINEDIGITAL, an automotive-IT specialist since 2009, held to a standard the numbers prove.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                className="tile-hover bg-white rounded-[18px] border border-[#ececef] p-7 flex flex-col"
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#f1f1f3] overflow-hidden shrink-0">
                    <ImageWithFallback src={r.thumb} alt={r.product} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[#0b0b0c] font-bold text-[16px] leading-tight">{r.product}</p>
                    <p className="text-[#5c6478] text-[14px] leading-tight mt-0.5">{r.tagline}</p>
                  </div>
                </div>
                <p className="text-[#5c6478] text-[15px] leading-[24px] flex-grow">{r.body}</p>
                <div className="flex items-center justify-between mt-7">
                  <span className="text-[#9a9aa3] text-[14px]">Review on SGcarmart</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-[var(--finevu-orange)] text-[var(--finevu-orange)]" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore FineVu — horizontal carousel (hidden for now; flip `false` to re-enable) */}
      {false && (
      <section className="bg-[#f7f7f7] py-20 overflow-hidden" data-nav-theme="light">
        <div className="max-w-[1480px] mx-auto px-6">
          <div className="relative flex items-center justify-center mb-10">
            <h2 className={HEAD}>Explore FineVu</h2>
            <div className="absolute right-0 flex gap-2">
              <button onClick={() => scrollBy(-1)} aria-label="Previous"
                className="w-9 h-9 rounded-lg bg-white border border-[#e4e4e8] flex items-center justify-center text-[#0b0b0c] hover:bg-[#0b0b0c] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollBy(1)} aria-label="Next"
                className="w-9 h-9 rounded-lg bg-white border border-[#e4e4e8] flex items-center justify-center text-[#0b0b0c] hover:bg-[#0b0b0c] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[max(1.5rem,calc((100%-1480px)/2+1.5rem))] pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {exploreItems.map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group snap-start shrink-0 w-[440px] max-w-[82vw]"
            >
              <div className="relative aspect-[664/330] rounded-[16px] overflow-hidden bg-[#d4d4d8]">
                <ImageWithFallback src={a.image} alt={a.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <div className="text-center px-4 pt-5">
                <p className="text-[#0b0b0c] font-bold text-[18px]">{a.title}</p>
                <p className="text-[#5c6478] text-[15px] leading-[24px] mt-2 line-clamp-2">{a.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Where to buy / Install / Support */}
      <LearnMoreLinks className='!pt-0' />

      {/* Disclaimers */}
      <section className="bg-[#ededf0] py-10" data-nav-theme="light">
        <div className="max-w-[1240px] mx-auto px-6 space-y-5">
          {disclaimers.map((d) => (
            <div key={d.n} className="text-[#8b8b95] text-[13px] leading-[19px]">
              <p className="mb-0.5">{d.n}. {d.title}</p>
              <p className="pl-4 max-w-[1219px]">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
