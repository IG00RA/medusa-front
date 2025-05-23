import MoreThanPrintSlider from "./MoreThanPrintSlider"
import MoreThanPrintText from "./MoreThanPrintText"

const MoreThanPrintSection = () => {
  return (
    <section className="bg-[var(--color-light-blue)] py-12 px-4">
      <div className="max-w-[1408px] mx-auto flex flex-col lg:flex-row gap-8 items-center">
        <MoreThanPrintText />

        <MoreThanPrintSlider />
      </div>
    </section>
  )
}

export default MoreThanPrintSection
