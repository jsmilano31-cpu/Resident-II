import { ArrowDown, ArrowUpRight } from "lucide-react";
import { project, showcaseGroups, renderByFile } from "@/data/project";
import { MediaImage } from "@/components/MediaImage";
import { SiteHeader } from "@/components/SiteHeader";
import { Motion } from "@/components/Motion";
import { FloorPlans } from "@/components/FloorPlans";
import { ImageCarousel } from "@/components/ImageCarousel";
function Heading({ id, number, title, japanese, text }: { id: string; number: string; title: string; japanese: string; text: string }) {
 return <div className="chapter-heading"><div><span className="eyebrow">{number} / <span lang="ja">{japanese}</span></span><h2 id={id}>{title}</h2></div><p>{text}</p></div>;
}
export default function Home() {
 const { exterior, shared, privateRooms, details } = showcaseGroups;
 return <Motion><SiteHeader /><main id="main">
  <section id="hero" className="house-hero" aria-labelledby="hero-title">
   <div className="hero-copy"><div><span className="eyebrow">THE RESIDENCE II</span><h1 id="hero-title">A contemporary<br />two-storey home.</h1></div><div className="hero-intro"><p>Warm timber tones. Generous rooflines.<br />A closer look at your future home.</p><a className="text-link" href="#layers">Discover the house <ArrowDown size={20}/></a></div></div>
   <figure className="house-portrait"><MediaImage image={project.hero} priority sizes="100vw"/><figcaption><span>THE COMPLETE EXTERIOR</span><a href="#layout">View the floor plans <ArrowUpRight size={18}/></a></figcaption></figure>
  </section>
  <section id="layers" className="section" aria-labelledby="exterior-title"><Heading id="exterior-title" number="01" title="The house, from every angle." japanese="外観" text="Explore the facade, sheltered entrance, and open-air balcony."/><ImageCarousel items={exterior} label="Exterior"/></section>
  <section id="living" className="section warm-section" aria-labelledby="living-title"><Heading id="living-title" number="02" title="Come inside." japanese="暮らしの空間" text="Living, dining, and gathering spaces, brought into view."/><ImageCarousel items={shared} label="Shared living"/></section>
  <section id="retreat" className="section" aria-labelledby="retreat-title"><Heading id="retreat-title" number="03" title="Your own space." japanese="寝室" text="Explore the bedrooms and the primary suite."/><ImageCarousel items={privateRooms} label="Private rooms"/></section>
  <section id="layout" className="section plan-section" aria-labelledby="layout-title"><Heading id="layout-title" number="04" title="Understand the whole home." japanese="間取り" text="Two levels, shown in full. Select a plan to enlarge it."/><FloorPlans/></section>
  <section id="collection" className="section" aria-labelledby="details-title"><Heading id="details-title" number="05" title="The details of everyday." japanese="住まいのディテール" text="Stairs, bathrooms, and supporting spaces complete the picture."/><ImageCarousel items={details} label="Everyday details"/></section>
  <section id="finale" className="section closing" aria-labelledby="finale-title"><div className="chapter-heading"><h2 id="finale-title">Picture yourself here.</h2><a className="text-link" href="#hero">Back to the house <ArrowUpRight size={20}/></a></div><MediaImage image={renderByFile("MAIN EXTERIOR PERSPECTIVES 1.png")} sizes="95vw"/></section>
 </main><footer className="site-footer"><a className="wordmark" href="#hero">THE RESIDENCE II</a><p>41 architectural perspectives / 2 floor plans</p><small>Supplied renders illustrate the proposed design. Furniture, finishes and landscaping represent visual design intent.</small></footer></Motion>;
}
