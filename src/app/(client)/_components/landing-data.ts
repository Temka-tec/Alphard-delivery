export const navItems = [
  { href: "/booking", label: "Машинууд" },
  { href: "/booking", label: "Жолоочид" },
  { href: "/about", label: "Тухай" },
] as const;

export const stats = [
  { value: "120+", label: "Идэвхтэй машин" },
  { value: "85+", label: "Жолооч" },
  { value: "12", label: "Компани" },
  { value: "4.9★", label: "Үнэлгээ" },
] as const;

export const companies = [
  {
    name: "Altai Motors",
    detail: "8 машин · Улаанбаатар",
    mark: "A",
    className: "bg-[var(--color-gold)] text-[var(--color-ink)]",
  },
  {
    name: "Steppe Drive",
    detail: "12 машин · Дархан",
    mark: "S",
    className: "bg-[#1A6B8A] text-white",
  },
  {
    name: "Gobi Rentals",
    detail: "6 машин · Өмнөговь",
    mark: "G",
    className: "bg-[#3A5A2A] text-white",
  },
] as const;

export const flowSteps = [
  {
    title: "Бүртгүүлэх",
    description: "Clerk-р хялбар бүртгэл",
  },
  {
    title: "Машин сонгох",
    description: "Сул машинаас захиалга",
  },
  {
    title: "Жолооч хүлээн авна",
    description: "Мэдэгдэл автоматаар очно",
  },
  {
    title: "Аяллаа эхлүүл",
    description: "Дуусмагц төлбөр тооцоо",
  },
] as const;

export const driverSteps = [
  "Хэрэглэгчээр бүртгүүлэх (Clerk)",
  'Профайл → "Жолооч болох" товч',
  "Утас, имэйл, зураг, жолооны үнэмлэх",
  "Машины мэдээлэл, зураг оруулах",
  "Бидэнд имэйлээр хүсэлт ирнэ → Баталгаажуулна",
] as const;
