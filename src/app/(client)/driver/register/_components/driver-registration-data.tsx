import {
  Armchair,
  Camera,
  Car,
  ChevronLeft,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

export const progressSteps = [
  { label: "Хэрэглэгч", status: "done" },
  { label: "Жолооч мэдээлэл", status: "active" },
  { label: "Машины мэдээлэл", status: "upcoming" },
  { label: "Хүсэлт илгээх", status: "upcoming" },
] as const;

export const personalFields = [
  {
    label: "Овог",
    required: true,
    placeholder: "Болд",
    type: "text",
    hint: "",
  },
  {
    label: "Нэр",
    required: true,
    placeholder: "Батаа",
    type: "text",
    hint: "",
  },
  {
    label: "Утасны дугаар",
    required: true,
    placeholder: "+976 9900 0000",
    type: "tel",
    hint: "",
  },
  {
    label: "И-мэйл хаяг",
    required: true,
    placeholder: "bataa@example.com",
    type: "email",
    hint: "Clerk бүртгэлийн имэйлтэй ижил байна",
  },
  {
    label: "Регистрийн дугаар",
    required: true,
    placeholder: "",
    type: "text",
    hint: "",
  },
  {
    label: "Төрсөн огноо",
    required: true,
    placeholder: "",
    type: "date",
    hint: "",
  },
] as const;

export const documentPhotoSlots = [
  {
    id: "licenseFront" as const,
    icon: <ClipboardList size={28} />,
    title: "Урд тал",
    subtitle: "Тодорхой, бүтэн",
  },
  {
    id: "licenseBack" as const,
    icon: <RefreshCw size={28} />,
    title: "Ар тал",
    subtitle: "Тодорхой, бүтэн",
  },
  {
    id: "licenseSelfie" as const,
    icon: <Camera size={28} />,
    title: "Selfie + үнэмлэх",
    subtitle: "Нэгэн зэрэг",
  },
];

export const carPhotoSlots = [
  {
    id: "carFront" as const,
    icon: <Car size={28} />,
    title: "Урд тал",
    subtitle: "Гаднаас",
  },
  {
    id: "carBack" as const,
    icon: <ChevronLeft size={28} />,
    title: "Ар тал",
    subtitle: "Дугаар харагдах",
  },
  {
    id: "carInterior" as const,
    icon: <Armchair size={28} />,
    title: "Дотор тал",
    subtitle: "Сандал, хүрд",
  },
];
