import Link from "next/link";
import { Header } from "../_components/Header";

const values = [
  {
    title: "Найдвартай сонголт",
    description:
      "Машин, жолооч, хүсэлтийн мэдээллийг нэг урсгалаар хянаж, аялал эхлэхээс өмнө хэрэглэгчид тодорхой мэдээлэл өгдөг.",
    mark: "01",
  },
  {
    title: "Хүний төвтэй туршлага",
    description:
      "Платформын гол зорилго нь зөвхөн захиалга биш, харин тайван, итгэлтэй аяллын туршлага бүтээх юм.",
    mark: "02",
  },
  {
    title: "Монгол нөхцөлд таарсан",
    description:
      "Хот, хөдөө, уулын чиглэл, олон хоногийн аялал, гэр бүлийн хэрэгцээ зэрэг бодит хэрэглээнд суурилсан шийдэл.",
    mark: "03",
  },
] as const;

const milestones = [
  "Хэрэглэгч машин, жолооч, үнэ, нөхцөлийг нэг дороос харна.",
  "Жолооч хүсэлтээ онлайнаар илгээж, баг баталгаажуулна.",
  "Батлагдсан машин, жолоочтой захиалга илүү хурдан, итгэлтэй хийгдэнэ.",
  "Ирээдүйд компани, fleet, review, live availability зэрэг боломжууд нэмэгдэнэ.",
] as const;

const trustPoints = [
  {
    label: "120+",
    text: "идэвхтэй машин, чиглэл бүрт тохирох сонголт",
  },
  {
    label: "85+",
    text: "жолооч, хүсэлтээр баталгаажуулж нэмэгдэж буй экосистем",
  },
  {
    label: "1-7 хоног",
    text: "уян хатан хугацаатай аялал, захиалгын урсгал",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <section className="relative overflow-hidden border-b border-white/8 px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_26%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="fade-in-up inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-[11px] tracking-[0.08em] text-[var(--color-gold)] motion-reduce:animate-none sm:text-xs">
              <span>ABOUT ALPHARD</span>
            </div>

            <h1 className="fade-in-up fade-in-up-delay-1 mt-6 max-w-4xl font-display text-4xl font-extrabold leading-none tracking-[-0.08em] motion-reduce:animate-none sm:text-6xl lg:text-7xl">
              Монголд илүү
              <br />
              <span className="text-[var(--color-gold)]">
                итгэлтэй, тав тухтай
              </span>
              <br />
              аяллын туршлага
            </h1>

            <p className="fade-in-up fade-in-up-delay-2 mt-6 max-w-2xl text-sm leading-7 text-[var(--color-muted)] motion-reduce:animate-none sm:text-lg sm:leading-8">
              ALPHARD бол жолоочтой машин түрээсийн үйлчилгээг илүү ойлгомжтой,
              цэгцтэй, чанартай болгох зорилготой платформ. Хэн нэгнээс дугаар
              асууж, олон чат дамжихын оронд захиалга, жолоочийн хүсэлт, машины
              мэдээлэл бүгд нэг урсгалд багтана.
            </p>

            <div className="fade-in-up fade-in-up-delay-3 mt-10 flex flex-col gap-3 motion-reduce:animate-none sm:flex-row sm:flex-wrap">
              <Link
                href="/booking"
                className="rounded-xl bg-[var(--color-gold)] px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
              >
                Машин үзэх
              </Link>
              <Link
                href="/driver/register"
                className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)]"
              >
                Жолоочийн хүсэлт өгөх
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="fade-in-up fade-in-up-delay-1 rounded-[28px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(180deg,rgba(201,168,76,0.12),rgba(201,168,76,0.03))] p-6 motion-reduce:animate-none">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">
                Бидний зорилго
              </div>
              <p className="mt-4 text-lg leading-8 text-[var(--color-text)]">
                Машин түрээсийг зүгээр нэг захиалга биш, харин аялах итгэлийг
                өгдөг үйлчилгээ болгох.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {trustPoints.map((point, index) => (
                <div
                  key={point.label}
                  className="fade-in-up rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5 motion-reduce:animate-none"
                  style={{ animationDelay: `${0.12 * index}s` }}
                >
                  <div className="font-display text-3xl font-bold text-[var(--color-gold)]">
                    {point.label}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {point.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="fade-in-up rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-7 motion-reduce:animate-none">
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Бид хэрхэн эхэлсэн бэ
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em]">
              Энгийн нэг асуудлаас эхэлсэн
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Монголд жолоочтой машин хайх үед ихэнхдээ танилын сүлжээ,
              давхардсан чат, тодорхой бус үнэ, баталгаагүй мэдээлэлтэй
              тулгардаг. ALPHARD энэ задгай процессыг илүү системтэй, цэгцтэй
              болгохоор бүтээгдсэн.
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Хэрэглэгчийн талд хялбар захиалга, жолоочийн талд ойлгомжтой
              хүсэлтийн урсгал, платформын талд баталгаажуулалт гэсэн гурван
              хэсгийг нэгтгэж, итгэл дээр суурилсан marketplace болгохыг зорьж
              байна.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <article
                key={value.title}
                className="fade-in-up rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-6 motion-reduce:animate-none"
                style={{
                  animationDelay: `${0.08 * (Number(value.mark) - 1)}s`,
                }}
              >
                <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                  {value.mark}
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {value.description}
                </p>
              </article>
            ))}

            <article className="fade-in-up fade-in-up-delay-4 rounded-[28px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))] p-6 motion-reduce:animate-none sm:col-span-2">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">
                Product Direction
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em]">
                Зүгээр listing биш, бүрэн аяллын ecosystem
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text)]/80">
                Ирээдүйд бодит availability, илүү нарийн жолоочийн үнэлгээ,
                fleet management, илүү хүчтэй admin tooling, компани төвтэй
                удирдлага зэрэг боломжуудыг шат дараатай нэмэхээр төлөвлөж
                байна.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[linear-gradient(180deg,var(--color-surface),transparent)] px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Бидний зам
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] sm:text-4xl">
              Платформ хэрхэн ажилладаг, цааш хаашаа явж байгаа вэ
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {milestones.map((item, index) => (
              <div
                key={item}
                className="fade-in-up relative overflow-hidden rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-6 motion-reduce:animate-none"
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <div className="absolute right-4 top-4 font-display text-5xl font-bold text-white/5">
                  0{index + 1}
                </div>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] text-sm text-[var(--color-gold)]">
                    {index + 1}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[32px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-panel))] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div className="fade-in-up motion-reduce:animate-none">
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Хамт өсгөе
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em]">
              Аялалд зориулсан илүү чанартай платформ бүтээж байна
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Хэрэв та найдвартай захиалга хайж буй хэрэглэгч, эсвэл өөрийн
              машиныг чанартай үйлчилгээнд нэгтгэхийг хүссэн жолооч бол ALPHARD
              таны дараагийн алхам байж чадна.
            </p>
          </div>

          <div className="fade-in-up fade-in-up-delay-2 flex flex-col gap-3 motion-reduce:animate-none sm:flex-row sm:flex-wrap">
            <Link
              href="/booking"
              className="rounded-xl bg-[var(--color-gold)] px-6 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
            >
              Захиалга эхлүүлэх
            </Link>
            <Link
              href="/driver/register"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)]"
            >
              Жолоочоор нэгдэх
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
