export default function Home() {
  return (
    <main className="p-20 flex flex-col justify-center items-center">
      <div className="flex justify-center items-center gap-4 flex-col">
        <h1 className="font-lobster font-bold text-4xl text-teal-500">
          Highlighters
        </h1>
        <p className="text-sm">
          Highlighters is a social media app where you can upload a moment from
          your life that you find was a highlight for that time period. For
          example: if you went on a nice hike one day which you found really
          made your mood better, you can upload an image of that hike with a
          description to the daily highlight timeframe. At the end of the week
          you can look at the highlights you did for each daily of that week and
          then choose which one you want to be your weekly highlight. You then
          repeat this for each of the weekly highlights to choose your monthly
          and then monthly for your yearly. This makes you think about all the
          good highlights you have had in the previous time periods. You can
          then look back on all the highlights you have had from each timeframe
          and remember how good life can be!
        </p>
      </div>
    </main>
  );
}
