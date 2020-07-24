import { get, map } from "lodash";
import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { UserProfile } from "@/components/proptypes";
import DynamicComponent from "@/components/DynamicComponent";
import DynamicForm from "@/components/dynamic-form/DynamicForm";

import User from "@/services/user";
import { currentUser } from "@/services/auth";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";

import UserGroups from "./UserGroups";
import useUserGroups from "../hooks/useUserGroups";

export default function UserInfoForm(props) {
  const { user, onChange } = props;

  const { groups, allGroups, isLoading: isLoadingGroups } = useUserGroups(user);

  const handleChange = useImmutableCallback(onChange);

  const saveUser = useCallback(
    (values, successCallback, errorCallback) => {
      const data = {
        ...values,
        id: user.id,
      };

      User.save(data)
        .then(user => {
          successCallback("Сохранено.");
          handleChange(User.convertUserInfo(user));
        })
        .catch(error => {
          errorCallback(get(error, "response.data.message", "Failed saving."));
        });
    },
    [user, handleChange]
  );

  const formFields = useMemo(
    () =>
      map(
        [
          {
            name: "name",
            title: "Имя",
            type: "text",
            initialValue: user.name,
          },
          {
            name: "email",
            title: "Email",
            type: "email",
            initialValue: user.email,
          },
          !user.isDisabled && currentUser.id !== user.id
            ? {
                name: "group_ids",
                title: "Группы",
                type: "select",
                mode: "multiple",
                options: map(allGroups, group => ({ name: group.name, value: group.id })),
                initialValue: map(groups, group => group.id),
                loading: isLoadingGroups,
                placeholder: isLoadingGroups ? "Загрузка..." : "",
              }
            : {
                name: "group_ids",
                title: "Группы",
                type: "content",
                content: isLoadingGroups ? "Загрузка..." : <UserGroups data-test="Groups" groups={groups} />,
              },
        ],
        field => ({ readOnly: user.isDisabled, required: true, ...field })
      ),
    [user, groups, allGroups, isLoadingGroups]
  );

  return (
    <DynamicComponent name="UserProfile.UserInfoForm" {...props}>
      <DynamicForm fields={formFields} onSubmit={saveUser} hideSubmitButton={user.isDisabled} />
    </DynamicComponent>
  );
}

UserInfoForm.propTypes = {
  user: UserProfile.isRequired,
  onChange: PropTypes.func,
};

UserInfoForm.defaultProps = {
  onChange: () => {},
};
