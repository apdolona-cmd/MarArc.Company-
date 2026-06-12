import { useStore, getPermissions, RankPermission } from '../store/useStore';

export function usePermissions(): RankPermission & { isManager: boolean } {
  const { currentUser, isManagerLoggedIn } = useStore();
  
  if (!currentUser) {
    return {
      pages: [],
      actions: {
        canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: false,
        canAddClient: false, canEditClient: false, canDeleteClient: false,
        canSendEmail: false, canViewTaxes: false, canEditSettings: false,
        canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: false,
      },
      isManager: false,
    };
  }
  
  if (isManagerLoggedIn) {
    return {
      pages: ['all'],
      actions: {
        canViewAllEmployees: true, canViewOtherSalaries: true, canViewOwnSalary: true,
        canAddClient: true, canEditClient: true, canDeleteClient: true,
        canSendEmail: true, canViewTaxes: true, canEditSettings: true,
        canManageEmployees: true, canPaySalaries: true, canViewActivity: true, canViewOrganization: true,
      },
      isManager: true,
    };
  }
  
  return { ...getPermissions(currentUser.rank), isManager: false };
}
