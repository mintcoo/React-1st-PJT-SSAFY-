import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { showPublicModal } from "../../store/store";
import styles from "./RoomUserProfile.module.css";

const PublicModal = ({ data, socket }: { data: any; socket?: any }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // 내 아이디
  const myName = localStorage.getItem("Username");
  const bgDiv = useRef<HTMLDivElement>(null);
  // 띄울 메시지
  const [message, setMessage] = useState<string>("");
  // 취소 버튼 보이기 여부
  const [isCancelBtn, setIsCancelBtn] = useState<boolean>(false);
  // 포차 방 번호
  const [roomName, setRoomName] = useState<string>("");
  // 이미지 데이터
  const [modalImg, setModalImg] = useState<string>("");

  //  axios 요청
  const api = axios.create({
    baseURL: "https://i8e201.p.ssafy.io/api",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  // 메시지 구분하기
  useEffect(() => {
    const { msg, pochaId, img } = data;
    // 모든 공통으로 메시지 세팅
    setMessage(msg);
    switch (data.type) {
      case "tag":
        break;
      case "addTime":
        setRoomName(pochaId);
        setIsCancelBtn(true);
        break;
      case "jjan":
        setIsCancelBtn(true);
        setRoomName(pochaId);
        setModalImg(img);
        break;
      case "exit":
        setRoomName(pochaId);
        setIsCancelBtn(true);
        break;
    }
  }, []);

  // 포차 시간 추가 이벤트
  async function handlePochaExtension() {
    // axios를 통해 포차 시간 연장. (await 사용해야할 듯?)
    try {
      await api.put(`/pocha/extension/${roomName}`);
      socket.emit("pocha_extension", roomName);
      toast.success("시간을 연장하였습니다");
    } catch (error) {
      console.log("시간추가 error", error);
    }
  }

  // 포차 짠!! 이벤트
  async function handlePochaCheers() {
    // axios를 통해 포차 짠 실행.
    try {
      await api.put(`/pocha/alcohol/${roomName}`);
      socket.emit("pocha_cheers", roomName);
    } catch (error) {
      console.log("짠 error", error);
    }
  }

  // 포차 나가기 요청
  async function handlePochaExit() {
    try {
      await api.put("/pocha/exit", {
        isHost: false,
        pochaId: roomName,
        username: myName, // << 여기 내 유저네임 가져와야함
        waiting: false,
      });
      navigate(`/main`);
      toast.success("방에서 나오셨습니다");
    } catch (error) {
      console.log("포차나가기 error", error);
    }
  }

  // 배경 클릭시 모달 끄는 함수
  const BgCloseModal = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === bgDiv.current) {
      dispatch(showPublicModal(false));
    }
  };

  // 확인 클릭시 처리
  const onClickConfirm = () => {
    switch (data.type) {
      case "tag":
        break;
      case "addTime":
        handlePochaExtension();
        break;
      case "jjan":
        handlePochaCheers();
        break;
      case "exit":
        handlePochaExit();
        setIsCancelBtn(true);
        break;
    }
    // 모달 끄기
    dispatch(showPublicModal(false));
  };

  // 취소 클릭시 모달 끄는 함수
  const onClickCancel = () => {
    dispatch(showPublicModal(false));
  };

  return (
    <div
      ref={bgDiv}
      onMouseDown={BgCloseModal}
      className="bg-slate-800 bg-opacity-50 flex justify-center z-20 items-center fixed top-0 right-0 bottom-0 left-0"
    >
      <div className="bg-black px-16 pt-14 pb-7 rounded-md text-center">
        {modalImg && <img src={modalImg} alt="modalImg" className="w-44" />}
        <div className="text-xl mb-6 font-bold text-white">
          {/* <span className="font-bold text-purple-300">{`${message}`}</span> */}
          {`${message}`}
        </div>
        <input
          onClick={onClickConfirm}
          className={`${styles.createBtn} cursor-pointer`}
          type="button"
          value="확인"
        />
        {isCancelBtn && (
          <input
            onClick={onClickCancel}
            className={`${styles.cancelBtn} cursor-pointer`}
            type="button"
            value="취소"
          />
        )}
      </div>
    </div>
  );
};

export default PublicModal;