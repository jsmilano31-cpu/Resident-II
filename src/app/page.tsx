import { ArrowUpRight } from "lucide-react";
import { showcaseGroups, renderByFile } from "@/data/project";
import { MediaImage } from "@/components/MediaImage";
import { MoodBoard } from "@/components/MoodBoard";
import { SiteHeader } from "@/components/SiteHeader";
import { Motion } from "@/components/Motion";
import { CinematicEntrance } from "@/components/CinematicEntrance";
import { FloorPlans } from "@/components/FloorPlans";
import { ArchitecturalGallery } from "@/components/ArchitecturalGallery";
export default function Home() {
 return <Motion><SiteHeader/><main id="main"><CinematicEntrance/>
 <section id="concept" className="section project-intro" aria-labelledby="concept-title"><span className="eyebrow">01 / THE PROJECT <span lang="ja">住まいについて</span></span><div className="intro-layout"><h2 id="concept-title" data-reveal>A home shaped<br/>around life.</h2><p data-reveal>Generous rooflines frame the arrival. Inside, warm textures and connected spaces set the scene for everyday living.</p></div><figure className="wide-frame" data-reveal><MediaImage image={renderByFile("LIVING AREA VIEW 2.png")} sizes="95vw"/><figcaption>Living room / A place to settle in.</figcaption></figure></section>
 <section id="layers" className="section story" aria-labelledby="story-title"><div className="chapter-heading"><span className="eyebrow">02 / ARCHITECTURAL LANGUAGE</span><h2 id="story-title" data-reveal>Lines of shelter.<br/>Layers of warmth.</h2></div><figure className="wide-frame" data-reveal><MediaImage image={renderByFile("MAIN EXTERIOR PERSPECTIVES 2.png")} sizes="95vw"/><figcaption>Rooflines, pale surfaces, and timber tones frame the house.</figcaption></figure><div id="living" className="paired-story"><figure data-reveal><MediaImage image={renderByFile("DINING AREA VIEW 2.png")}/><figcaption>Shared moments / Dining</figcaption></figure><figure data-reveal><MediaImage image={renderByFile("KITCHEN AREA VIEW 2.png")}/><figcaption>Everyday rituals / Kitchen</figcaption></figure></div>
 <MoodBoard />
 </section>
 <section id="collection" className="section gallery-section" aria-labelledby="gallery-title"><div className="chapter-heading"><div><span className="eyebrow">03 / THE RESIDENCE <span lang="ja">空間を巡る</span></span><h2 id="gallery-title" data-reveal>Explore<br/>your home.</h2></div><p>Choose a space. Change your perspective. Discover your home at your own pace.</p></div><ArchitecturalGallery items={Object.values(showcaseGroups).flat()} label="Residence perspectives"/></section>
 <section id="layout" className="section plan-section" aria-labelledby="layout-title"><div className="chapter-heading"><div><span className="eyebrow">04 / FLOOR PLANS <span lang="ja">間取り</span></span><h2 id="layout-title" data-reveal>The whole home,<br/>considered.</h2></div><p>Two levels. Select a plan to take a closer look.</p></div><FloorPlans/></section>
 <section id="finale" className="closing" aria-labelledby="finale-title"><MediaImage image={renderByFile("MAIN EXTERIOR PERSPECTIVES 1.png")} sizes="100vw"/><div className="closing-copy"><span className="eyebrow">THE RESIDENCE II</span><h2 id="finale-title">Imagine life here.</h2><div><a className="text-link" href="#collection">Explore the spaces <ArrowUpRight size={16}/></a><a className="text-link" href="#layout">View the plans <ArrowUpRight size={16}/></a></div></div></section>
 </main><footer className="site-footer"><a className="wordmark" href="#hero">THE RESIDENCE II</a><p>Architectural design presentation</p><small>Supplied renders illustrate the proposed design. Furniture, finishes and landscaping represent visual design intent.</small></footer></Motion>;
}
