import { Fragment, h } from "preact";
import ToolIconButton from "./ToolIconButton";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
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
  data: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>;
  colName: string;
  variant?: string;
}

export default function FollowButtons(props: FollowButtonsProps) {
  const { user, data, colName, ...rest } = props;

  const followColl = collection(db, colName);
  const followQuery = query(followColl, where("userId", "==", user?.uid));
  const [userFollows] = useCollection(followQuery);

  const addToFollow = async () => {
    return await addDoc(followColl, {
      userId: user?.uid,
      followId: data.id,
      followRef: data.ref,
    });
  };

  const unFollow = async () => {
    // this should only happen one at a time
    // just get the follow doc an delete
    const q = query(
      followColl,
      where("followId", "==", data.id),
      where("userId", "==", user?.uid)
    );
    const del = await getDocs(q);
    del.docs.map(async (d) => {
      await deleteDoc(d.ref);
    });
    // await deleteDoc(followRef);
  };

  const checkFollowing = () => {
    const matched = userFollows?.docs.filter((followed) => {
      return followed.data().followId === data?.id;
    });
    if (matched && matched.length > 0) return true;
    return false;
  };

  return (
    <Fragment>
      <Fragment>
        {checkFollowing() ? (
          <ToolIconButton
            aria-label="Un-Follow"
            icon={GroupRemoveOutlinedIcon}
            onClick={unFollow}
            {...rest}
          />
        ) : (
          <ToolIconButton
            aria-label="Follow"
            icon={GroupAddOutlinedIcon}
            onClick={addToFollow}
            {...rest}
          />
        )}
      </Fragment>
    </Fragment>
  );
}
