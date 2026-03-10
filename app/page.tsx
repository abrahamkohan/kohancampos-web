import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { PositioningStrip } from "@/components/positioning-strip"
import { About } from "@/components/about"
import { ValueProposition } from "@/components/value-proposition"
import { Specialties } from "@/components/specialties"
import { WhyParaguay } from "@/components/why-paraguay"
import { Process } from "@/components/process"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PositioningStrip />
        <About />
        <ValueProposition />
        <Specialties />
        <WhyParaguay />
        <Process />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
