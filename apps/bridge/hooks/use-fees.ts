import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { Chain, formatUnits, parseUnits } from "viem";
import { useFeeData } from "wagmi";

import { ChainDto } from "@/codegen/model";
import { configurations } from "@/config/contract-addresses";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import {
  EASY_MODE_GAS_FEES,
  FINALIZE_GAS,
  PROVE_GAS,
} from "@/constants/gas-limits";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { useDeployment } from "./use-deployment";
import { useNativeToken } from "./use-native-token";

export const useFees = (
  from: Chain | ChainDto | undefined,
  gasEstimate: bigint | undefined
) => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const forceViaL1 = useConfigState.useForceViaL1();
  const easyMode = useConfigState.useEasyMode();
  const currency = useSettingsState.useCurrency();
  const { t } = useTranslation();

  const nativeToken = useNativeToken();

  const feeData = useFeeData({
    chainId: forceViaL1 && withdrawing ? deployment?.l1.id : from?.id,
  });

  let networkFee = 0;
  if (feeData.data && gasEstimate) {
    const gwei =
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! * gasEstimate;
    networkFee = parseFloat(formatUnits(gwei, 18));
  }

  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);

  const EASY_MODE_GWEI_THRESHOLD =
    EASY_MODE_GAS_FEES[deployment?.l1.id ?? 0] ?? 1;
  const PROVE_COST =
    PROVE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  const FINALIZE_COST =
    FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  const easyModeCost = parseFloat(formatUnits(PROVE_COST + FINALIZE_COST, 18));

  return [
    {
      name: t("fees.networkGas", {
        chain: forceViaL1 && withdrawing ? deployment?.l1.name : from?.name,
      }),
      usd: {
        raw: nativeTokenUsdPrice
          ? networkFee! * nativeTokenUsdPrice
          : undefined,
        formatted: nativeTokenUsdPrice
          ? `${currencySymbolMap[currency]}${(
              networkFee! * nativeTokenUsdPrice
            ).toLocaleString("en", {
              maximumFractionDigits: 4,
            })}`
          : undefined,
      },
      token: {
        token: null,
        raw: networkFee,
        formatted: `${networkFee!.toLocaleString("en", {
          maximumFractionDigits: 4,
        })} ${nativeToken?.[from?.id ?? 0]?.symbol}`,
      },
    },
    configurations[deployment?.name ?? ""] && withdrawing
      ? {
          name: t("fees.easyModeFee"),
          usd:
            easyMode && nativeTokenUsdPrice
              ? {
                  raw: easyModeCost * nativeTokenUsdPrice,
                  formatted: `${currencySymbolMap[currency]}${(
                    easyModeCost * nativeTokenUsdPrice
                  ).toLocaleString("en")}`,
                }
              : null,
          token: easyMode
            ? {
                token: null,
                raw: easyModeCost,
                formatted: `${easyModeCost.toLocaleString("en", {
                  maximumFractionDigits: 4,
                })} ETH`,
              }
            : null,
        }
      : null,
  ].filter(isPresent);
};
