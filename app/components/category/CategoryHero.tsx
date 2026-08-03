import Container from "../ui/Container";

interface Props {
  title: string;
  description: string;
  banner: string;
}

export default function CategoryHero({
  title,
  description,
  banner,
}: Props) {
  return (
    <section className="relative h-[420px] overflow-hidden">
      <img
        src={banner}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <Container>
        <div className="relative flex h-[420px] items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold">
              {title}
            </h1>

            <p className="mt-6 text-lg leading-8">
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}