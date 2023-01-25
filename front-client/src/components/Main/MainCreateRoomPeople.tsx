import { useState, useRef, useEffect } from "react";

const MainCreateRoomPeople = ({ selectOption }: { selectOption: string[] }) => {
  const [selectTitle, ...selectPeople] = selectOption;
  const selectHumans = useRef<any>([]);
  // console.log('12',selectHumans.current);
  const [people, setPeople] = useState(selectHumans.current[0]);
  

  useEffect(() => {
    // setPeople(selectHumans.current[0]);
    // people?.classList.toggle("text-black");
    // people?.classList.toggle("bg-white");
    console.log('2',selectHumans.current[0])
    selectHumans.current[0].classList.toggle("text-black");
    selectHumans.current[0].classList.toggle("bg-white");
  }, [])
  // const selectRegionAll = useRef<any>(null);
  // const selectRegionCity = useRef<any>(null);

  const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('3',people);
    if (event.target !== people) {
      people?.classList.toggle("text-black");
      people?.classList.toggle("bg-white");
      (event.target as Element).classList.toggle("text-black");
      (event.target as Element).classList.toggle("bg-white");
      setPeople(event.target);
    } else {
      console.log("같다")
    }

    // people.classList.toggle("text-black");
    // people.classList.toggle("bg-white");
  };
  return (
    <div className="flex w-full h-12 mb-10 font-bold items-center">
      <div className="text-left text-xl mr-10">{selectTitle}</div>
      {selectPeople.map((people, index) => (
        <div
          onClick={onSelect}
          key={index}
          ref={(tag) => {
            selectHumans.current[index] = tag;
          }}
          className="mr-4 border-2 rounded-full border-white w-16 h-full text-lg flex justify-center items-center cursor-pointer"
        >
          {people}
        </div>
      ))}
    </div>
  );
};

export default MainCreateRoomPeople;
