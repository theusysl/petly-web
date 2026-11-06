
import { Brand } from "./Brand";

export default function Footer() {
  return <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-[#6f837d] md:flex-row md:items-center md:px-8">
    <Brand compact/>
    <span>Feito para aproximar quem cuida de quem precisa.</span>
    <div className="flex gap-5 md:ml-auto">
      <a href="#adotar">Adotar</a>
      <a href="#perdidos">Achados e perdidos</a>
      <a href="mailto:contato@petly.com">Contato</a>
    </div>
  </footer>;
}
