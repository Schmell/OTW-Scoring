import { Fragment, h } from "preact";
import ToolIconButton from "./ToolIconButton";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  DocumentSnapshot,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../util/firebase-config";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupRemoveOutlinedIcon from "@mui/icons-material/GroupRemoveOutlined";
import { User } from "firebase/auth";

interface FollowButtonsProps {
  user: User | null | undefined;
  data:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>
    | undefined;
  //   dataId: string;
  colName: string;
  variant?: string;
}

export default function FollowButtons(props: FollowButtonsProps) {
  const { user, data, colName, ...rest } = props;
  const followRef = collection(db, colName);
  const userFollow = query(followRef, where("userId", "==", user?.uid));
  const [followOrgs, followLoading] = useCollection(userFollow);

  const addToFollow = async (followId) => {
    const added = await addDoc(followRef, {
      userId: user?.uid,
      followId: followId,
    });
  };

  const unFollow = async (followId) => {
    const q = query(
      followRef,
      where("followId", "==", followId),
      where("userId", "==", user?.uid)
    );
    const del = await getDocs(q);
    del.docs.map(async (d) => {
      await deleteDoc(d.ref);
    });
  };

  const checkFollowing = () => {
    const matched = followOrgs?.docs.filter((followed) => {
      return followed.data().followId === data?.id;
    });
    // console.log("matched ", matched?.length);
    if (matched && matched.length > 0) return true;
    return false;
  };
  // console.log("checkFollowing(); ", checkFollowing());

  return (
    <Fragment>
      <Fragment>
        {checkFollowing() ? (
          <ToolIconButton
            aria-label="Un-Follow"
            icon={GroupRemoveOutlinedIcon}
            onClick={() => {
              unFollow(data?.id);
            }}
            {...rest}
          />
        ) : (
          <ToolIconButton
            aria-label="Follow"
            icon={GroupAddOutlinedIcon}
            onClick={() => {
              addToFollow(data?.id);
            }}
            {...rest}
          />
        )}
      </Fragment>
    </Fragment>
  );
}
