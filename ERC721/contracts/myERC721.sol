// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyERC721 is ERC721, AccessControl {
    uint256 private _tokenIdCounter;
    
    string private constant BASE_URI = "https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/";

    constructor() ERC721("MyNFT", "MNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _safeMint(msg.sender, 0); // 초기 NFT 민팅
    }

    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}