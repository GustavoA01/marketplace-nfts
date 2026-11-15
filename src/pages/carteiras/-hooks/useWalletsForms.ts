import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { walletSchema, type WalletFormValues } from "@/data/schemas/wallets";
import type { Wallet } from "@/data/types/wallets";
import { toFormValues } from "./useWalletsMutations";

const emptyWalletValues: WalletFormValues = {
  displayName: "",
  alias: "",
  network: "",
  profileName: "",
  address: "",
  secondaryAddress: "",
  walletType: "",
  referralCode: "",
  email: "",
  ensSuffix: ".eth",
  ensName: "",
};

const secondaryFromMain = (mainValues: WalletFormValues): WalletFormValues => ({
  ...mainValues,
  alias: mainValues.alias
    ? `${mainValues.alias} (secundária)`
    : "Carteira secundária",
});

type UseWalletsFormsParams = {
  userId?: string;
  wallets?: Wallet[];
  mainWallet?: Wallet;
  secondaryWallet?: Wallet;
};

export const useWalletsForms = ({
  userId,
  wallets,
  mainWallet,
  secondaryWallet,
}: UseWalletsFormsParams) => {
  const previousUserIdRef = useRef(userId);
  const [secondaryFormOpened, setSecondaryFormOpened] = useState(false);
  const [sameAsMain, setSameAsMain] = useState(false);

  const mainForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: emptyWalletValues,
  });

  const secondaryForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: emptyWalletValues,
  });

  const hasSecondaryWallet = Boolean(secondaryWallet);
  const isEditingSecondary = hasSecondaryWallet || secondaryFormOpened;

  useEffect(() => {
    if (previousUserIdRef.current === userId) return;
    previousUserIdRef.current = userId;
    mainForm.reset(emptyWalletValues);
    secondaryForm.reset(emptyWalletValues);
    setSecondaryFormOpened(false);
    setSameAsMain(false);
  }, [userId, mainForm, secondaryForm]);

  useEffect(() => {
    if (!wallets) return;
    if (!mainForm.formState.isDirty) {
      mainForm.reset(mainWallet ? toFormValues(mainWallet) : emptyWalletValues);
    }
    if (secondaryWallet && !secondaryForm.formState.isDirty) {
      secondaryForm.reset(toFormValues(secondaryWallet));
    }
  }, [wallets, mainWallet, secondaryWallet, mainForm, secondaryForm]);

  const mainValues = useWatch({ control: mainForm.control });

  useEffect(() => {
    if (!sameAsMain) return;
    secondaryForm.reset(
      secondaryFromMain({
        ...emptyWalletValues,
        ...mainValues,
        ensSuffix: mainValues.ensSuffix === ".xyz" ? ".xyz" : ".eth",
      }),
    );
  }, [sameAsMain, mainValues, secondaryForm]);

  const buildSecondarySubmitValues = (data: WalletFormValues) => {
    if (!sameAsMain) return data;
    const values = secondaryFromMain(mainForm.getValues());
    secondaryForm.reset(values);
    return values;
  };

  const openSecondaryForm = () => {
    setSecondaryFormOpened(true);
    if (!secondaryWallet) secondaryForm.reset(emptyWalletValues);
  };

  const onSameAsMainChange = (checked: boolean) => {
    setSameAsMain(checked);
    if (!checked) return;
    setSecondaryFormOpened(true);
    secondaryForm.reset(secondaryFromMain(mainForm.getValues()));
  };

  return {
    mainForm,
    secondaryForm,
    sameAsMain,
    hasSecondaryWallet,
    isEditingSecondary,
    setSecondaryFormOpened,
    buildSecondarySubmitValues,
    openSecondaryForm,
    onSameAsMainChange,
  };
};
