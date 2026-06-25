import ExploreDestinations from "../components/components/ExploreDestinations";
import WhyJoin from "../components/components/WhyJoin";
import FeaturePage from "../components/home/Feature";
import HeroBanner from "../components/home/Hero";
import RecipesPage from "../components/home/Recipes";

export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <RecipesPage />
        <FeaturePage />
        <WhyJoin />
        <ExploreDestinations />
        <br /> 4. Additional Sections <br /> 5. Additional Sections
        <br />
      </main>
    </>
  );
}
