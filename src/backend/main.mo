import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Random "mo:core/Random";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();

  // Include authorization mixin for role management
  include MixinAuthorization(accessControlState);

  // Initialize the invite links system state
  let inviteState = InviteLinksModule.initState();

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : ?Text;
  };

  // Store user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Get caller's own user profile (users only)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile (own profile or admin viewing others)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save caller's user profile (users only)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Generate invite code (admin only)
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  // Submit RSVP (public - any user including guests, but requires valid invite code)
  // The invite code validation is handled by the InviteLinksModule
  public shared ({ caller }) func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  // Get all RSVPs (admin only)
  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  // Get all invite codes (admin only)
  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };
};
